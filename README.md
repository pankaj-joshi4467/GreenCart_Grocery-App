# 🛒 GreenCart - Grocery Delivery Website  

GreenCart is a full-featured **Grocery Delivery Website** built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  
It provides an online platform for users to order groceries securely with **Stripe payment integration**, while the **Admin Panel** allows easy product, user, and order management.  

🚀 **Live Demo:** [Click Here](https://green-cart-pankaj-grocery-app.vercel.app/)  

---

## 📌 Features  

- ✅ **User-Friendly Frontend** – Built with **React.js** and styled using **Tailwind CSS**  
- ✅ **Secure Authentication** – Implemented with **JWT** & **bcrypt** for password hashing  
- ✅ **Admin Dashboard** – Manage products, users, and orders easily  
- ✅ **Stripe Payment Integration** – Safe and secure online payments  
- ✅ **Cloudinary Integration** – For product image upload and storage  
- ✅ **API Handling** – Managed with **Axios** for smooth communication  
- ✅ **Responsive Design** – Works on desktop, tablet, and mobile  

---

## 🏗️ Tech Stack  

**Frontend:**  
- React.js  
- Tailwind CSS  
- Axios  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB  
- JWT Authentication  
- Bcrypt for password encryption  

**Other Integrations:**  
- Stripe (Payments)  
- Cloudinary (Image Uploads)  

---

## 📂 Project Structure  

```bash
GreenCart/
│
├── frontend/        # React.js Frontend Code
├── backend/         # Node.js + Express.js Backend Code
└── README.md        # Project Documentation
⚙️ Installation & Setup

Clone the Repository

git clone https://github.com/your-username/GreenCart.git
cd GreenCart


Install Dependencies

# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install


Set Environment Variables
Create a .env file in the backend/ folder and add the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET=your_stripe_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret


Run the Project

# Start backend
cd server
npm run dev

# Start client
cd ../client
npm run server


👨‍💻 Author

Pankaj Joshi



