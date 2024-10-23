import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {BrowserRouter,Routes,Route} from "react-router-dom";

import LandingPage from './components/Common/LandingPage.jsx';
import Header from './components/Common/Header.jsx';
import About from './components/Common/About.jsx';
import ContactUs from './components/Common/ContactUs.jsx';
import Login from './components/Login/Login.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import RetailerPage from './components/Retailer/RetailerPage.jsx';
import RetailerHeader from './components/Retailer/Header.jsx';
import SupplierPage from './components/Supplier/SupplierPage';
import SupplierHeader from './components/Supplier/Header.jsx';
import RetailerMarketplace from './components/Retailer/RetailerMarketplace.jsx';
import QuotationsPage from './components/Retailer/QuotationsPage.jsx';
import ComplaintsPage from './components/Retailer/ComplaintsPage.jsx';


function App() {

  return (
    <BrowserRouter>
     <Routes>
        <Route path='/' element={<Header />} >
         <Route index element={<LandingPage/>}  />
         <Route path="/about" element={<About />}/>
         <Route path="/contactUs" element={<ContactUs />} />
        </Route>

        <Route path='/login' element={<Login/>}/>
        <Route path='/signUp' element={<SignUp/>}/>

        <Route path='/retailer' element={<RetailerHeader/>}>
          <Route index element={<RetailerPage/>}/>
          <Route path='marketplace' element={<RetailerMarketplace/>}/>
          <Route path='manageQuotations' element={<QuotationsPage />}/>
          <Route path='complaints' element={<ComplaintsPage />}/>
        </Route>

        <Route path='/supplier' element={<SupplierHeader/>}>
          <Route index element={<SupplierPage/>}/>
        </Route>
     </Routes>
    </BrowserRouter>

  );
}

export default App;



