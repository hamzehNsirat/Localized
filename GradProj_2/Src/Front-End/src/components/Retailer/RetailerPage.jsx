import 'bootstrap/dist/css/bootstrap.min.css';
import pic from '../../assets/user.png';

import ManagementSection from './ManagmentSection.jsx';
import { FaUserCircle, FaStore, FaQuestionCircle } from 'react-icons/fa'; 
import { Container } from 'react-bootstrap';

const RetailerPage = () => {
    return (

        <>
        <div style={{height:'110vh',width:'70vw', flexDirection:'column'}} className='container d-flex justify-content-center text-dark'>
           <div className='d-flex justify-content-between gap-3 mt-5' >
             <div>
               <h2 className='fw-bold'>Welcome, Retailer!</h2>
               <h5>Complete your profile information</h5>
             </div>
             <img src={pic} alt='Logo' width='40px' height='40px'/>
           </div>
           <Container className="mt-4 px-0 d-flex flex-column gap-3">
            <ManagementSection
                icon={<FaUserCircle color="#A93C3C" />}
                title="Manage Profile"
                description="Complete your profile information"
                buttonText="Manage"
                progress={60} // example progress bar value
            />
            <ManagementSection
                icon={<FaStore color="#A93C3C" />}
                title="Manage Establishment"
                description="Edit / Update information"
                buttonText="Manage"
            />
            <ManagementSection
                icon={<FaQuestionCircle color="#A93C3C" />}
                title="Manage Quotations"
                description="See and manage your quotations"
                buttonText="Manage"
            />
        </Container>
      </div>
      </>

    );
  };
  
  export default RetailerPage;