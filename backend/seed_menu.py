"""Run from the backend/ directory: python seed_menu.py"""
from app import create_app
from app.extensions import db
from app.models.menu import MenuItem

ITEMS = [
    # ── Veg starters ──
    {"name": "Paneer Tikka",         "description": "Cubes of marinated cottage cheese grilled in a tandoor with peppers and onions. Served with mint chutney.", "price": 280, "category": "Veg"},
    {"name": "Veg Spring Rolls",     "description": "Crispy golden rolls stuffed with stir-fried vegetables, glass noodles, and aromatic sauces.", "price": 180, "category": "Veg"},
    {"name": "Stuffed Mushrooms",    "description": "Button mushrooms filled with herbed cream cheese and sun-dried tomatoes, baked until golden.", "price": 220, "category": "Veg"},
    {"name": "Dahi Puri",            "description": "Crisp puris filled with spiced potato, tamarind chutney, and chilled yogurt. A street-food classic.", "price": 140, "category": "Veg"},

    # ── Non-Veg starters ──
    {"name": "Chicken Tikka",        "description": "Boneless chicken marinated in yogurt and spices, chargrilled in a clay oven. Served with green chutney.", "price": 320, "category": "Non-Veg"},
    {"name": "Seekh Kebab",          "description": "Minced lamb with fresh herbs, ginger, and green chillies, skewered and cooked over charcoal.", "price": 360, "category": "Non-Veg"},
    {"name": "Crispy Calamari",      "description": "Lightly battered squid rings, flash-fried and served with a zesty lemon-aioli dipping sauce.", "price": 390, "category": "Non-Veg"},
    {"name": "Prawn Koliwada",       "description": "Whole prawns in a tangy Mumbai-style batter, deep-fried and finished with a chaat masala dusting.", "price": 420, "category": "Non-Veg"},

    # ── Veg mains ──
    {"name": "Butter Paneer Masala", "description": "Soft paneer simmered in a rich, velvety tomato-butter gravy with fenugreek and cream.", "price": 310, "category": "Veg"},
    {"name": "Dal Makhani",          "description": "Black lentils slow-cooked overnight in butter, cream, and aromatic spices. A North Indian icon.", "price": 260, "category": "Veg"},
    {"name": "Palak Kofta",          "description": "Cottage cheese dumplings in a silky spinach-based gravy scented with nutmeg and cardamom.", "price": 290, "category": "Veg"},
    {"name": "Mushroom Biryani",     "description": "Fragrant basmati rice layered with spiced mushrooms, caramelised onions, and saffron.", "price": 320, "category": "Veg"},
    {"name": "Pav Bhaji",            "description": "A hearty mash of seasonal vegetables in spiced tomato gravy, served with buttered soft buns.", "price": 180, "category": "Veg"},
    {"name": "Veg Thai Green Curry", "description": "Baby vegetables and tofu in an aromatic coconut-lemongrass green curry. Served with jasmine rice.", "price": 340, "category": "Veg"},

    # ── Non-Veg mains ──
    {"name": "Chicken Butter Masala","description": "Tender chicken in an iconic orange-hued tomato-cream sauce, perfumed with kasuri methi.", "price": 370, "category": "Non-Veg"},
    {"name": "Mutton Rogan Josh",    "description": "Slow-braised lamb in a deep Kashmiri gravy of dried chillies, fennel, and whole spices.", "price": 450, "category": "Non-Veg"},
    {"name": "Prawn Masala",         "description": "Jumbo prawns cooked in a coastal-style masala of coconut, tamarind, and Konkani spices.", "price": 490, "category": "Non-Veg"},
    {"name": "Chicken Biryani",      "description": "Long-grained basmati rice dum-cooked with spiced chicken, rose water, and crispy fried onions.", "price": 400, "category": "Non-Veg"},
    {"name": "Fish Amritsari",       "description": "Fresh basa fillets marinated in ajwain-spiced batter, deep-fried until perfectly crunchy.", "price": 430, "category": "Non-Veg"},
    {"name": "Mutton Keema Naan",    "description": "Tandoor-baked naan stuffed with spiced minced mutton, served with a side of raita.", "price": 340, "category": "Non-Veg"},

    # ── Breads & Rice ──
    {"name": "Garlic Naan",          "description": "Pillowy tandoor-baked flatbread brushed with garlic butter and topped with fresh coriander.", "price": 80,  "category": "Veg"},
    {"name": "Lachha Paratha",       "description": "Multi-layered whole-wheat flatbread, flaky and buttery, cooked on a tawa.", "price": 70,  "category": "Veg"},
    {"name": "Steamed Basmati Rice", "description": "Perfectly cooked long-grain aged basmati. A simple, essential accompaniment.", "price": 60,  "category": "Veg"},
    {"name": "Jeera Rice",           "description": "Basmati rice tempered with cumin seeds and ghee. Light, fragrant, and comforting.", "price": 90,  "category": "Veg"},

    # ── Desserts ──
    {"name": "Gulab Jamun",          "description": "Soft milk-solid dumplings soaked in rose-cardamom sugar syrup. Served warm with a scoop of vanilla ice cream.", "price": 120, "category": "Veg"},
    {"name": "Rasmalai",             "description": "Delicate chenna patties soaked in chilled saffron-infused milk, garnished with pistachios.", "price": 140, "category": "Veg"},
    {"name": "Chocolate Lava Cake",  "description": "Warm dark chocolate cake with a molten ganache centre, served with salted caramel ice cream.", "price": 210, "category": "Veg"},
    {"name": "Mango Kulfi",          "description": "Dense and creamy Indian ice cream made with condensed milk and Alphonso mango pulp.", "price": 130, "category": "Veg"},

    # ── Drinks ──
    {"name": "Mango Lassi",          "description": "Thick, chilled yogurt drink blended with sweet Alphonso mangoes. Refreshing and indulgent.", "price": 100, "category": "Veg"},
    {"name": "Masala Chai",          "description": "Robust Indian tea brewed with ginger, cardamom, cinnamon, and fresh milk.", "price": 60,  "category": "Veg"},
    {"name": "Fresh Lime Soda",      "description": "Sparkling water with fresh lime, a pinch of black salt, and your choice of sweet or salted.", "price": 80,  "category": "Veg"},
]

def seed():
    app = create_app()
    with app.app_context():
        db.session.query(MenuItem).delete()
        db.session.commit()

        for data in ITEMS:
            item = MenuItem(
                name=data["name"],
                description=data["description"],
                price=data["price"],
                category=data["category"],
                is_available=True,
            )
            db.session.add(item)

        db.session.commit()
        print(f"Seeded {len(ITEMS)} menu items.")

if __name__ == "__main__":
    seed()
