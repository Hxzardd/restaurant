import { useEffect, useState } from "react";
import api from "../api/axios";

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
    <div className="py-10 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2
            className="font-display font-bold mb-1"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#f2ece0" }}
          >
            Menu Management
          </h2>
          <p className="text-sm" style={{ color: "#5c4e42" }}>
            Add, edit, or remove items from your restaurant menu.
          </p>
        </div>

        {/* ── Form ── */}
        <div
          className="rounded-xl border p-7 mb-8"
          style={{ backgroundColor: "#1d1915", borderColor: editingId ? "rgba(224,144,64,0.4)" : "#38302a" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold" style={{ color: "#f2ece0" }}>
              {editingId ? "Edit Item" : "Add New Item"}
            </h3>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="text-xs font-semibold transition-colors duration-150"
                style={{ color: "#5c4e42" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e09040")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5c4e42")}
              >
                Cancel editing ×
              </button>
            )}
          </div>

          <form onSubmit={submitForm} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#a89478" }}>
                  Item Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Paneer Tikka"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#a89478" }}>
                  Price (₹)
                </label>
                <input
                  name="price"
                  type="number"
                  placeholder="e.g. 250"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#a89478" }}>
                Description
              </label>
              <input
                name="description"
                placeholder="Brief description of the dish"
                value={form.description}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1 max-w-xs">
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#a89478" }}>
                  Category
                </label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95"
                style={{ backgroundColor: "#e09040", color: "#0f0d0b" }}
                onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = "#cc7e2e")}
                onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = "#e09040")}
              >
                {loading ? "Saving…" : editingId ? "Update Item" : "Add Item"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Menu Grid ── */}
        {menu.length === 0 ? (
          <div
            className="rounded-xl border p-14 text-center"
            style={{ backgroundColor: "#1d1915", borderColor: "#38302a" }}
          >
            <p className="font-display text-2xl font-bold mb-2" style={{ color: "#f2ece0" }}>No items yet</p>
            <p className="text-sm" style={{ color: "#5c4e42" }}>Add your first menu item above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {menu.map((item, idx) => (
              <div
                key={item.id}
                className={`card-hover p-5 flex flex-col ${editingId === item.id ? "ring-1 ring-ember-DEFAULT" : ""}`}
                style={{ animationDelay: `${(idx % 6) * 0.05}s`, ...(editingId === item.id ? { borderColor: "#e09040" } : {}) }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display text-lg font-bold leading-snug flex-1" style={{ color: "#f2ece0" }}>
                    {item.name}
                  </h3>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                    style={
                      item.category === "Veg"
                        ? { backgroundColor: "rgba(90,178,133,0.12)", color: "#5ab285" }
                        : { backgroundColor: "rgba(200,90,90,0.12)", color: "#c85a5a" }
                    }
                  >
                    {item.category}
                  </span>
                </div>

                <p className="font-display text-2xl font-bold mb-2" style={{ color: "#e09040" }}>
                  ₹{item.price}
                </p>
                <p className="text-sm leading-relaxed flex-1 mb-5 line-clamp-2" style={{ color: "#5c4e42" }}>
                  {item.description}
                </p>

                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "#2a2320" }}>
                  <button
                    onClick={() => editItem(item)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 active:scale-95"
                    style={{ borderColor: "#38302a", color: "#a89478" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#e09040"; e.currentTarget.style.color = "#e09040"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#38302a"; e.currentTarget.style.color = "#a89478"; }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 active:scale-95"
                    style={{ borderColor: "rgba(200,90,90,0.3)", color: "#c85a5a" }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(200,90,90,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMenu;
