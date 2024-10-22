import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import '../../style/signUp.css';
import retailerPic1 from '../../assets/retailer1.png';
import retailerPic2 from '../../assets/retailer2.png';
import supplierPic1 from '../../assets/supplier1.png';
import supplierPic2 from '../../assets/supplier2.png';

import SignUpStep1 from './SignUpStep1.jsx';
import SignUpStep2 from './SignUpStep2.jsx';
import SignUpStep3 from './SignUpStep3.jsx';
import SignUpStep4 from './SignUpStep4.jsx';

const SignUp = () => {

const pics = {
    'retailer':[retailerPic1,retailerPic2],
    'supplier':[supplierPic1,supplierPic2],
}

const [currentStep, setCurrentStep] = useState(1);
const [isChecked, setIsChecked] = useState(false);


const handleCurrentStep = (step)=>{
    setCurrentStep(step);
}

const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
  };
    
const [formData, setFormData] = useState({
    position: 'retailer',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    website: '',
    address: '',
    street:'',
    buildingNo:'',
    description: '',
    logo: null,
    category: null,
});

const nextStep = () => {
    setCurrentStep(currentStep + 1);
};


 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
};

const handleFileUpload = (e) => {
    setFormData({
        ...formData,
        logo: e.target.files[0]
    });
};

const renderStep = () => {
    switch (currentStep) {
        case 1:
            return (
                <SignUpStep1
                    formData={formData}
                    handleInputChange={handleInputChange}
                    nextStep={nextStep}
                    isChecked={isChecked}
                    handleCheckboxChange={handleCheckboxChange}
                />
            );
        case 2:
            return (
                <SignUpStep2
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFileUpload={handleFileUpload}
                    nextStep={nextStep}
                />
            );
        case 3:
            return (
                <SignUpStep3
                    formData={formData}
                    handleInputChange={handleInputChange}
                    nextStep={nextStep}
                />
            );
        case 4: return (
          <SignUpStep4 formData={formData} />
        );
        default:
            return null;
    }
};



    return (
      <div  style={{height:'100vh'}} className='d-flex align-items-center'>
        <div className={`${(currentStep===1||currentStep===2) && 'container'} px-5 py-4 d-flex justify-content-center align-items-center text-light`}  style={{backgroundColor:'#BB4430', height:'max-content',minHeight:'100%',width: `${(currentStep === 1 || currentStep === 2) ? '45vw' : '100vw'}`
               ,flexDirection:'column',boxShadow: '5px 0px 6px rgba(0, 0, 0, 0.5)'}}>

            {renderStep()}
            <div className='d-flex gap-1 mt-2'>
                <div 
                    onClick={()=>handleCurrentStep(1)}
                    className='lvl-1' 
                    style={{
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: currentStep === 1 ? 'white' : 'black', 
                        borderRadius: '100px'
                }}>
                </div>
                <div 
                    onClick={()=>isChecked && handleCurrentStep(2)}
                    className='lvl-2' 
                    style={{
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: currentStep === 2 ? 'white' : 'black', 
                        borderRadius: '100px'
                    }}>
                </div>
                <div 
                    onClick={()=>isChecked && handleCurrentStep(3)}
                    className='lvl-3' 
                    style={{
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: currentStep === 3 ? 'white' : 'black', 
                        borderRadius: '100px'
                    }}>
                </div>
                <div 
                    onClick={()=>isChecked && handleCurrentStep(4)}
                    className='lvl-4' 
                    style={{
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: currentStep === 4 ? 'white' : 'black', 
                        borderRadius: '100px'
                    }}>
                </div>
            </div>
        </div>
       { (currentStep===1 || currentStep===2) && <div className='w-75 d-flex justify-content-center align-items-center'  style={{ height:'100vh'}}>
            <img src={formData.position==='retailer'? pics['retailer'][currentStep-1]:pics['supplier'][currentStep-1]} className='w-20' style={{width:'40vw'}} alt={formData.position} />
        </div>}
      </div>
    );
  };
  
  export default SignUp;