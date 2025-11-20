import { createContext, useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { useAuth, useUser } from "@clerk/clerk-react";

const AppContext = createContext();

export const AppContextProvider = (props) =>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const {user} = useUser()
    const {getToken} = useAuth()

     

    const [searchFilter,setSearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched,setIsSearched] = useState(false)
    
    const [jobs,setJobs] = useState([])
 
    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)

    const [companyToken,setCompanyToken] = useState(null)
    const [companyData,setCompanyData] = useState(null)

    const [userData,setUserData] = useState(null)
    const [userApplications,setUserApplications] = useState([])

    const [loadingUser, setLoadingUser] = useState(true);

    //function to fetch jobs -
    const fetchJobs = async () =>{
        // setJobs(jobsData)
        try {
            
            const {data} = await axios.get(backendUrl + '/api/jobs') 

            if(data.success) {
                setJobs(data.jobs)
                console.log(data.jobs);
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch jobs');
        }
        
    }

    //function to fetch company data - 
    const fetchCompanyData = async () => {
        try {
            
            const {data} = await axios.get(backendUrl+'/api/company/company',{headers:{token:companyToken}})

            if(data.success){
                setCompanyData(data.company)
                console.log(data);
            }else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to fetch user data 
    const fetchUserData = async () => {
        try {
            console.log("Fetching user data...");

            if (!backendUrl) {
                toast.error("Backend URL is not configured");
                return;
            }

            const token = await getToken();
            console.log("Clerk Token:", token);

            if (!token) {
                console.log('No token available yet');
                setLoadingUser(false);
                return;
            }

            const {data} = await axios.get(backendUrl + '/api/users/user',
                {headers:{Authorization: `Bearer ${token}` },
            });

            console.log("Backend Response:", data);

                if(data.success){
                    setUserData(data.user)
                }else (
                    toast.error(data.message)
                )
                setLoadingUser(false)

        }catch (error){
            console.log("❌ Fetch User Error:", error);
            setLoadingUser(false);
            toast.error(error.message)
        }
    }


    useEffect(()=>{
        const storedToken = localStorage.getItem("companyToken");
        fetchJobs(storedToken)

        const storedCompanyToken = localStorage.getItem('companyToken')

        if(storedCompanyToken){
            setCompanyToken(storedCompanyToken)
        }

    },[])

    useEffect(()=>{
        if(companyToken){
            fetchCompanyData()
        }

    },[companyToken])

    useEffect(() =>{
        if(user){
            fetchUserData()
        }
    },[user])

    const value = {
        setSearchFilter,searchFilter,
        isSearched,setIsSearched,
        jobs,setJobs,
        showRecruiterLogin,setShowRecruiterLogin,
        companyToken,setCompanyToken,
        companyData,setCompanyData,
        backendUrl,
        userData,setUserData,
        userApplications,setUserApplications,
        loadingUser,setLoadingUser,
        fetchUserData
        

    }
    return (<AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>)
};
export const useAppContext = () => useContext(AppContext);
export { AppContext };
