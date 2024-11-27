import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"

 

const MyAppointments = () => {
  const {backendUrl, token} = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  

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
              <button className="text-sm text-stone-500 text-center sm:w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300 ">Pay Online</button>
              <button className="text-sm text-stone-500 text-center sm:w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300 ">Cancel appointment</button>
           </div>
          </div>
        )) }
      </div>

    </div>
  )
}

export default MyAppointments