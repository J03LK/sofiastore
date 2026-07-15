import { useState, useEffect } from 'react';
import { getAllClients } from '../../services/supabase/orderService';
import { FaSearch, FaWhatsapp, FaTiktok } from 'react-icons/fa';

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients();
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => 
    client.tiktok_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.whatsapp.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md w-full">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o número..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-noir-bg border border-gray-200 dark:border-noir-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm dark:text-white"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-noir-surface rounded-2xl shadow-sm border border-gray-100 dark:border-noir-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-textMain dark:text-gray-200">
            <thead className="text-xs text-textMuted dark:text-gray-400 uppercase bg-gray-50/50 dark:bg-noir-bg border-b border-gray-100 dark:border-noir-border">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">Usuario TikTok</th>
                <th className="px-6 py-4 font-medium tracking-wider">WhatsApp</th>
                <th className="px-6 py-4 font-medium tracking-wider">Fecha de Registro</th>
                <th className="px-6 py-4 font-medium tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-noir-border">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Cargando clientas...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron clientas
                  </td>
                </tr>
              ) : (
                filteredClients.map((client, index) => (
                  <tr key={client.id || index} className="hover:bg-gray-50/50 dark:hover:bg-noir-bg transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <FaTiktok className="text-gray-400" />
                      {client.tiktok_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaWhatsapp className="text-green-500" />
                        {client.whatsapp || <span className="text-gray-500 dark:text-gray-400">Sin registro</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`https://wa.me/${client.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-hover text-xs font-medium bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors inline-block"
                      >
                        Contactar
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
