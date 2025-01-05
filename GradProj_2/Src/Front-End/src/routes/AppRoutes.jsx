import { Routes, Route, Outlet } from "react-router-dom";
import { Header } from "../components/Common/index.js";
import { HomePage, About, ContactUs, NotFoundPage } from "../pages/index.js";
import { Login, SignUp } from "../components/Auth/index.js";

import SupplierHeader from "../components/Supplier/components/Header.jsx";
import RetailerHeader from "../components/Retailer/components/Header.jsx";

import {
  Profile,
  Complaints,
  AddComplaint,
  Marketplace,
  ManageQuotations,
  SupplierProducts,
  QuotationPage,
  Dashboard as RetailerDashboard,
  ViewQuotation,
  ThankYouPage,
  RateOrder,
} from "../components/Retailer/pages/index.js";

import {
  Dashboard as SupplierDashboard,
  ManageProducts,
  NewRequest,
  ProductForm,
  Marketplace as SupMarketplace,
  SupplierProducts as OtherSupProducts,
  ManageQuotations as SupManageQuotations,
  ViewQuotation as SupViewQuotation,
  Profile as SupProfile,
  Complaints as SupComplaints,
  ViewComplaint as SupViewComplaint,
  AddComplaint as SupAddComplaint,
} from "../components/Supplier/pages/index.js";
import {
  FavProvider,
  CompProvider,
  ReqProdProvider,
  QuotProvider,
  ProdProvider,
} from "../components/Providers/index.js";
import PrivateRoute from "./PrivateRoute";
import ViewComplaint from "../components/Retailer/pages/ViewComplaint.jsx";
import {
  AdminOutlet,
  Dashboard as AdminDashboard,
  Applications,
  Users,
  Quotations,
  Complaints as AdminComplaints,
  Categories,
  Penalties,
  ViewApplication,
  ViewComplaint as AdminViewComplaint,
  ViewQuotation as AdminViewQuotation,
  ViewUser,
  ViewPenalty,
  ViewCategory,
  AddUser,
} from "../components/Admin/pages/index.js";
import AdminSignUp from "../components/Auth/AdminSignUp/AdminSignUp.jsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Header />}>
      <Route index element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contactUs" element={<ContactUs />} />
    </Route>

    <Route path="/login" element={<Login />} />
    <Route path="/signUp" element={<SignUp />} />

    <Route path="*" element={<NotFoundPage />} />

    <Route path="/adminSignUp/:token" element={<AdminSignUp />} />

    <Route element={<PrivateRoute allowedRoles={["2"]} />}>
      <Route
        path="/retailer"
        element={
          <FavProvider>
            <CompProvider>
              <QuotProvider>
                <ReqProdProvider>
                  <RetailerHeader />
                </ReqProdProvider>
              </QuotProvider>
            </CompProvider>
          </FavProvider>
        }
      >
        <Route index element={<RetailerDashboard />} />

        <Route path="marketplace">
          <Route index element={<Marketplace />} />
          <Route path=":companyName/products">
            <Route index element={<SupplierProducts />} />
            <Route path="newQuotation" element={<QuotationPage />} />
          </Route>
        </Route>

        <Route path="manageQuotations">
          <Route index element={<ManageQuotations />} />
          <Route path=":quotationId">
            <Route index element={<ViewQuotation />} />
            <Route path="finishPurchase" element={<ThankYouPage />} />
            <Route path="rateOrder" element={<RateOrder />} />
          </Route>
        </Route>

        <Route path="complaints">
          <Route index element={<Complaints />} />
          <Route path="createComplaint" element={<AddComplaint />} />
          <Route path=":complaintId" element={<ViewComplaint />} />
        </Route>

        <Route path="profile" element={<Profile />} />
      </Route>
    </Route>

    <Route element={<PrivateRoute allowedRoles={["3"]} />}>
      <Route
        path="/supplier"
        element={
          <CompProvider>
            <QuotProvider>
              <ProdProvider>
                <SupplierHeader />
              </ProdProvider>
            </QuotProvider>
          </CompProvider>
        }
      >
        <Route index element={<SupplierDashboard />} />
        <Route path="products">
          <Route index element={<ManageProducts />} />
          <Route path="addProduct" element={<ProductForm />} />
          <Route path="product/:productId" element={<ProductForm />} />
        </Route>

        <Route path="manageQuotations">
          <Route index element={<SupManageQuotations />} />
          <Route path=":quotationId">
            <Route index element={<SupViewQuotation />} />
            <Route path="newRequest" element={<NewRequest />} />
          </Route>
        </Route>

        <Route path="complaints">
          <Route index element={<SupComplaints />} />
          <Route path="createComplaint" element={<SupAddComplaint />} />
          <Route path=":complaintId" element={<SupViewComplaint />} />
        </Route>
        <Route path="profile" element={<SupProfile />} />

        <Route path="marketplace">
          <Route index element={<SupMarketplace />} />
          <Route path=":companyName/products" element={<OtherSupProducts />} />
        </Route>
      </Route>
    </Route>

    <Route element={<PrivateRoute allowedRoles={["1"]} />}>
      <Route path="/admin" element={<AdminOutlet />}>
        <Route index element={<AdminDashboard />} />
        <Route path="applications">
          <Route index element={<Applications />} />
          <Route path="application/:appId" element={<ViewApplication />} />
        </Route>
        <Route path="users">
          <Route index element={<Users />} />
          <Route path="user/:userId" element={<ViewUser />} />
          <Route path="addUser" element={<AddUser />} />
        </Route>
        <Route path="quotations">
          <Route index element={<Quotations />} />
          <Route path="quotation/:quoId" element={<AdminViewQuotation />} />
        </Route>
        <Route path="complaints">
          <Route index element={<AdminComplaints />} />
          <Route path="complaint/:compId" element={<AdminViewComplaint />} />
        </Route>
        <Route path="categories">
          <Route index element={<Categories />} />
          <Route path="category/:catId" element={<ViewCategory />} />
        </Route>
        <Route path="penalties">
          <Route index element={<Penalties />} />
          <Route path="penalty/:penId" element={<ViewPenalty />} />
          <Route path="newPenalty" element={<ViewPenalty />} />
        </Route>
        {/* <Route path="policies">
          <Route index element={<Users />} />
          {/* <Route path="user/:userId" element={<ViewUser />} /> 
        </Route> */}
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
