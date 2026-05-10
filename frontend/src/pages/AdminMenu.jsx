import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, ChefHat } from "lucide-react";

const EMPTY_FORM = { name: "", description: "", price: "", category: "Veg" };

function AdminMenu() {
  const [menu, setMenu]         = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [loading, setLoading]   = useState(false);

  const fetchMenu = async () => {
    const res = await api.get("/menu");
    setMenu(res.data);
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, form);
      } else {
        await api.post("/menu", form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchMenu();
    } finally {
      setLoading(false);
    }
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    await api.delete(`/menu/${id}`);
    fetchMenu();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-10 px-4 sm:px-6 lg:px-8 bg-sand min-h-screen"
    >
      <div className="max-w-6xl mx-auto mt-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="font-display font-bold mb-2 text-forest" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Menu Management
          </h2>
          <p className="text-forest-muted text-lg">
            Add, edit, or remove items from your restaurant menu.
          </p>
        </div>

        {/* ── Form ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`card p-8 mb-10 transition-colors duration-300 ${editingId ? "ring-2 ring-sage-400 bg-sage-50" : ""}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl font-bold text-forest flex items-center gap-2">
              {editingId ? <Edit2 className="text-sage-600" /> : <Plus className="text-sage-600" />}
              {editingId ? "Edit Menu Item" : "Add New Item"}
            </h3>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 text-sm font-semibold text-forest-muted hover:text-red-500 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={submitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-earth">
                  Item Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Avocado Toast"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-earth">
                  Price (₹)
                </label>
                <input
                  name="price"
                  type="number"
                  placeholder="e.g. 250"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="input-field bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-earth">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Brief description of the dish..."
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="input-field bg-white resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-earth">
                  Category
                </label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field bg-white">
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-2"
              >
                {loading ? "Saving…" : editingId ? "Update Item" : (
                  <><Plus size={18} /> Add Item</>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* ── Menu Grid ── */}
        {menu.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white border border-sand-200 p-16 text-center shadow-soft"
          >
            <div className="text-5xl mb-5 opacity-80 text-forest-muted"><ChefHat size={64} className="mx-auto" /></div>
            <p className="font-display text-2xl font-bold mb-2 text-forest">No items yet</p>
            <p className="text-sm text-forest-muted">Add your first menu item above to start building your menu.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {menu.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: (idx % 6) * 0.05 }}
                  className={`card p-6 flex flex-col group ${editingId === item.id ? "ring-2 ring-sage-500 bg-sage-50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-xl font-bold leading-snug flex-1 text-forest">
                      {item.name}
                    </h3>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                        item.category === "Veg"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <p className="font-medium text-xl mb-3 text-sage-600">
                    ₹{item.price}
                  </p>
                  <p className="text-sm leading-relaxed flex-1 mb-6 line-clamp-2 text-forest-muted">
                    {item.description}
                  </p>

                  <div className="flex gap-3 pt-4 border-t border-sand-200">
                    <button
                      onClick={() => editItem(item)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-sand-100 text-forest hover:bg-sand-200"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default AdminMenu;
