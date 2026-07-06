import { useEffect, useState } from "react";
import api from "../api/axios";
import { CategoryBadge } from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Plus, Edit2, Trash2, X, ChefHat } from "lucide-react";

const EMPTY_FORM = { name: "", description: "", price: "", category: "Veg" };

function AdminMenu() {
  const [menu, setMenu]           = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenu(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load menu.");
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, form);
      } else {
        await api.post("/menu", form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchMenu();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save item.");
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
    try {
      await api.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete item.");
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="max-w-6xl mx-auto">
        <div className="animate-fade-up mb-8">
          <span className="eyebrow mb-2">Admin</span>
          <h1 className="font-display font-extrabold tracking-tight text-[clamp(2rem,5vw,3rem)] mb-2">
            Menu Management
          </h1>
          <p className="text-ink-soft">Add, edit, or remove items from the restaurant menu.</p>
        </div>

        {error && <div className="error-banner mb-6">{error}</div>}

        {/* ── Form ── */}
        <div className={`card p-8 mb-10 ${editingId ? "ring-2 ring-paprika" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              {editingId
                ? <><Edit2 size={20} className="text-paprika" aria-hidden="true" /> Edit Menu Item</>
                : <><Plus size={20} className="text-paprika" aria-hidden="true" /> Add New Item</>}
            </h2>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="btn-ghost px-3 py-1.5 text-sm"
              >
                <X size={16} aria-hidden="true" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={submitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="item-name" className="block text-xs font-bold tracking-widest uppercase mb-2 text-ink-soft">
                  Item Name
                </label>
                <input
                  id="item-name"
                  name="name"
                  placeholder="e.g. Paneer Butter Masala"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="item-price" className="block text-xs font-bold tracking-widest uppercase mb-2 text-ink-soft">
                  Price (₹)
                </label>
                <input
                  id="item-price"
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 250"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="item-description" className="block text-xs font-bold tracking-widest uppercase mb-2 text-ink-soft">
                Description
              </label>
              <textarea
                id="item-description"
                name="description"
                placeholder="Brief description of the dish…"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              <div className="w-full sm:w-1/3">
                <label htmlFor="item-category" className="block text-xs font-bold tracking-widest uppercase mb-2 text-ink-soft">
                  Category
                </label>
                <select id="item-category" name="category" value={form.category} onChange={handleChange} className="input-field">
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-8 py-3.5">
                {loading ? "Saving…" : editingId ? "Update Item" : (<><Plus size={18} aria-hidden="true" /> Add Item</>)}
              </button>
            </div>
          </form>
        </div>

        {/* ── Item grid ── */}
        {menu.length === 0 ? (
          <EmptyState
            icon={ChefHat}
            title="No items yet"
            text="Add your first menu item above to start building the menu."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
              <article
                key={item.id}
                className={`card p-6 flex flex-col ${editingId === item.id ? "ring-2 ring-paprika" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-lg font-bold leading-snug flex-1">{item.name}</h3>
                  <CategoryBadge category={item.category} />
                </div>

                <p className="font-display font-extrabold text-xl mb-3 text-paprika">₹{item.price}</p>
                <p className="text-sm leading-relaxed flex-1 mb-6 line-clamp-2 text-ink-soft">
                  {item.description}
                </p>

                <div className="flex gap-3 pt-4 border-t border-linen">
                  <button
                    onClick={() => editItem(item)}
                    className="btn-ghost flex-1 py-2.5 text-sm border border-linen"
                  >
                    <Edit2 size={15} aria-hidden="true" /> Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="btn-danger flex-1 py-2.5 text-sm"
                  >
                    <Trash2 size={15} aria-hidden="true" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMenu;
