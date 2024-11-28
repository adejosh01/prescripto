import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"
import { PaystackButton } from "react-paystack";
import { useNavigate } from "react-router-dom";

 

const MyAppointments = () => {
  const {backendUrl, token, getDoctorsData} = useContext(AppContext)

  const [appointments, setAppointments] = useState([])

  const navigate = useNavigate()

  const publicKey = 'pk_test_34060f484d4731155d6ada8a193e72c48d6df847';
  const amount = 5000 * 100; // Convert to kobo
  const email = "adelobajoshua19@gmail.com";


  const onSuccess = async (reference) => {
    console.log("Payment successful:", reference);

    try {
        // Verify payment on the backend
        const response = await axios.post(backendUrl + "/api/user/payment", {
          reference: reference.reference,
      });

      if (response.data.success) {
          alert("Payment verified successfully!");
          navigate('/')
      } else {
          alert("Payment verification failed!");
      }
      
    } catch (error) {

      console.error("Error verifying payment:", error);
      
      
    }


  }

  const componentProps = {
    email,
    amount,
    publicKey,
    text: "Pay Online",
    onSuccess,
    onClose: () => console.log("Payment closed"),
};


  

  const slotDateFormat = (slotDate) => {
    if (!slotDate) {
      return "Invalid date";
    }
  
    const dataArray = slotDate.split("_");
    if (dataArray.length < 3) {
      return "Invalid date format";
    }
  
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${dataArray[0]} ${months[Number(dataArray[1])]} ${dataArray[2]}`;
  };
  

  const getUserAppointments = async () => {
    try {
      const {data} = await axios.get(backendUrl + "/api/user/appointments",{headers:{token}})
      console.log(data)

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
     try {

      const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment', {appointmentId}, {headers: {token}})

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    
      
     } catch (error) {
      console.log(error)
      toast.error(error.message)
      
     }
  }



  useEffect(() => {
    if(token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
      <div>
        {appointments.map((item,index) =>(
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
               <img className="w-32 bg-indigo-50 " src={item.docData.image} alt="" />
            </div>
           <div className="flex-1 text-sm text-zin-600">
            <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
            <p>{item.docData.speciality}</p>
            <p className="text-zinc-700 font-medium mt-1">Address:</p>
            <p className="text-xs">{item.docData.address.line1}</p>
            <p className="text-xs">{item.docData.address.line2}</p>
            <p className="text-xs mt-1"><span className="text-sm text-neutral-700 font-medium ">Date & Time:</span> {slotDateFormat(item.slotDate)} || {item.slotTime}</p>
           </div>

           <div></div>
           <div className="flex flex-col gap-2 justify-end ">
             {!item.cancelled &&  <button className="text-sm text-stone-500 text-center sm:w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300 "><PaystackButton {...componentProps} /></button>}
             {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className="text-sm text-stone-500 text-center sm:w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300 ">Cancel appointment</button>}
             {item.cancelled && <button className="sm:min-w-48 py-2 border border-red-500 text-red-500 ">Appointment Cancelled</button>}
              
           </div>
          </div>
        )) }
      </div>

    </div>
  )
}

export default MyAppointments