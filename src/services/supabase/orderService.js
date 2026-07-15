import { supabase } from './supabaseClient';

// Helper for generating unique filenames
const generateUniqueFileName = (originalName) => {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomStr}.${extension}`;
};

/**
 * Uploads an image to the 'order-images' bucket
 */
export const uploadOrderImage = async (file) => {
  try {
    const fileName = generateUniqueFileName(file.name);
    
    const { data, error } = await supabase.storage
      .from('order-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('order-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading order image:', error);
    throw error;
  }
};

/**
 * Creates a new order with its items
 */
export const createOrder = async (clientName, items, totalAmount) => {
  try {
    // 1. Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        { 
          client_name: clientName, 
          total_amount: totalAmount,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Prepare items for insertion
    const itemsToInsert = items.map(item => ({
      order_id: orderData.id,
      price: item.price,
      image_url: item.imageUrl
    }));

    // 3. Insert items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return orderData;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Fetches all orders with their items (for admin)
 */
export const getOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Updates the status of an order
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Gets basic stats for the dashboard
 */
export const getOrderStats = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status, total_amount');

    if (error) throw error;

    const totalOrders = data.length;
    const totalAmount = data.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const pendingOrders = data.filter(o => o.status === 'pending').length;

    return {
      totalOrders,
      totalAmount,
      pendingOrders
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

/**
 * Gets a client by whatsapp
 */
export const getClientByWhatsapp = async (whatsapp) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('whatsapp', whatsapp)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
    return data; // returns null if not found
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
};

/**
 * Creates a new client
 */
export const createClient = async (whatsapp, tiktokName) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([{ whatsapp, tiktok_name: tiktokName }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

/**
 * Gets all orders for a specific client
 */
export const getClientOrders = async (clientName) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('client_name', clientName)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching client orders:', error);
    throw error;
  }
};

/**
 * Adds a payment (abono) to an order
 */
export const addPaymentToOrder = async (orderId, currentPaidAmount, newPayment) => {
  try {
    const totalPaid = Number(currentPaidAmount) + Number(newPayment);
    const { data, error } = await supabase
      .from('orders')
      .update({ paid_amount: totalPaid, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding payment to order:', error);
    throw error;
  }
};

/**
 * Deletes an order
 */
export const deleteOrder = async (orderId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

/**
 * Fetches all registered clients
 */
export const getAllClients = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

/**
 * Updates an order item (price and comment) and recalculates the order total
 */
export const updateOrderItem = async (itemId, orderId, newPrice, newComment) => {
  try {
    // 1. Update the item
    const { error: itemError } = await supabase
      .from('order_items')
      .update({ 
        price: newPrice, 
        comment: newComment 
      })
      .eq('id', itemId);

    if (itemError) throw itemError;

    // 2. Fetch all items for this order to recalculate total
    const { data: allItems, error: fetchError } = await supabase
      .from('order_items')
      .select('price')
      .eq('order_id', orderId);

    if (fetchError) throw fetchError;

    // 3. Calculate new total amount
    const newTotal = allItems.reduce((sum, item) => sum + Number(item.price), 0);

    // 4. Update the order with the new total amount
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .update({ total_amount: newTotal, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select('*, order_items(*)')
      .single();

    if (orderError) throw orderError;

    return orderData;
  } catch (error) {
    console.error('Error updating order item:', error);
    throw error;
  }
};

/**
 * Deletes a client
 */
export const deleteClient = async (clientId) => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};
