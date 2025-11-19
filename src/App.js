import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";
import { CartProvider } from "./context/CartContext";
import { ChatProvider, useChat } from "./context/ChatContext";
import Navbar from "./components/Navbar";
import ChatFloating from "./components/ChatFloating";
import ChatWindow from "./components/ChatWindow";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import UsedCars from "./pages/UsedCars";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import VehicleDetails from "./pages/VehicleDetails";
import Profile from "./pages/ProfilePage";
import NewsArticle from "./pages/NewsArticle";
import BrandModels from "./pages/BrandModels";
import VariantDetails from "./pages/VariantDetails";
import Configurator from "./pages/configurator/Configurator";
import ModelSelector from "./pages/configurator/ModelSelector";
import VariantSelector from "./pages/configurator/VariantSelector";
import EngineSelector from "./pages/configurator/EngineSelector";
import Appearance from "./pages/configurator/Appearance";
import Equipment from "./pages/configurator/Equipment";
import Summary from "./pages/configurator/Summary";
import StockVehiclePage from "./pages/StockVehiclePage";
import Cart from "./pages/Cart";
import PurchasePage from "./pages/PurchasePage";
import CarCalculator from "./pages/CarCalculator";
import TestDriveBookingPage from "./pages/testdrive/TestDriveBookingPage";
import TestDriveBrandSelect from "./pages/testdrive/TestDriveBrandSelect";
import TestDriveModelList from "./pages/testdrive/TestDriveModelList";
import UsedCarDetails from "./pages/UsedCarDetails";
import UsedCarResults from "./pages/UsedCarResults";
import UsedCarAdd from "./pages/UsedCarAdd";
import UsedCarImageAdd from "./pages/UsedCarImageAdd";
import UsedCarSummary from "./pages/UsedCarSummary";
import UsedMyCar from "./pages/UsedMyCar";
import UsedCarAdminList from "./pages/UsedCarAdminList";
import UsedMyCarDetails from "./pages/UsedMyCarDetails";
import UsedCarAdminEdit from "./pages/UsedCarAdminEdit";
import StoreLocatorPage from "./pages/StoreLocatorPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MessagesPage from "./pages/MessagesPage";
import FavoritesPage from "./pages/FavoritesPage";
import UsedCarMyReservations from "./pages/UsedCarMyReservations";

function ChatInitializer() {
  const { startChatWithUser } = useChat();

  React.useEffect(() => {
    window.openChatWithSeller = (sellerId, sellerName) => {
      startChatWithUser({
        userId: sellerId,
        name: sellerName || "Eladó",
      });
    };
  }, [startChatWithUser]);

  return null;
}

function ChatRenderer() {
  const { conversationsArray } = useChat();

  return (
    <>
      {conversationsArray.map((c) =>
        c.isOpen ? (
          <ChatWindow
            key={c.userId}
            otherUserId={c.userId}
            userName={c.userName}
          />
        ) : null
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <CartProvider>

          <ChatProvider>

            <ChatInitializer />

            <Router>

              <Navbar />
              <ChatFloating />
              <ChatRenderer />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/car/:id" element={<CarDetails />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />

                <Route path="/used-cars" element={<UsedCars />} />
                <Route path="/used-cars/my" element={<UsedMyCar />} />
                <Route path="/used-cars/admin" element={<UsedCarAdminList />} />
                <Route path="/used-cars/new-ad" element={<UsedCarAdd />} />
                <Route path="/used-cars/results" element={<UsedCarResults />} />
                <Route path="/used-cars/temp/images" element={<UsedCarImageAdd />} />
                <Route path="/used-cars/:id/images" element={<UsedCarImageAdd />} />
                <Route path="/used-cars/summary" element={<UsedCarSummary />} />
                <Route path="/used-cars/:id/summary" element={<UsedCarSummary />} />
                <Route path="/used-cars/:id" element={<UsedCarDetails />} />
                <Route path="/used-cars/my-reservations" element={<UsedCarMyReservations />} />

                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />

                <Route path="/news/:slug" element={<NewsArticle />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/vehicle-details" element={<VehicleDetails />} />

                <Route path="/brand/:brandName" element={<BrandModels />} />
                <Route path="/models/:variantId/details" element={<VariantDetails />} />

                <Route path="/stock/:vin" element={<StockVehiclePage />} />

                <Route path="/cart" element={<Cart />} />
                <Route path="/purchase" element={<PurchasePage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/mycars" element={<UsedMyCar />} />
                <Route path="/mycars/:id" element={<UsedMyCarDetails />} />

                <Route path="/used-cars/admin/:id/edit" element={<UsedCarAdminEdit />} />

                <Route path="/configurator" element={<Configurator />} />
                <Route path="/configurator/:brand" element={<ModelSelector />} />
                <Route path="/configurator/:brand/:model" element={<VariantSelector />} />
                <Route path="/configurator/:brand/:model/:variantId/engine" element={<EngineSelector />} />
                <Route path="/configurator/:brand/:model/:variantId/appearance" element={<Appearance />} />
                <Route path="/configurator/:brand/:model/:variantId/equipment" element={<Equipment />} />
                <Route path="/configurator/:brand/:model/:variantId/summary" element={<Summary />} />
                <Route path="/configurator/:brand/:model/:variantId" element={<Navigate to="engine" replace />} />

                <Route path="/test-drive/:brandName/:modelId/booking" element={<TestDriveBookingPage />} />
                <Route path="/test-drive" element={<TestDriveBrandSelect />} />
                <Route path="/test-drive/:brandName" element={<TestDriveModelList />} />

                <Route path="/car-calculator" element={<CarCalculator />} />
                <Route path="/stores" element={<StoreLocatorPage />} />
                <Route path="/order-summary/:orderId" element={<OrderSummaryPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />

                <Route path="*" element={<NotFound />} />
              </Routes>

            </Router>

          </ChatProvider>
        </CartProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
