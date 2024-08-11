import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./Admin_Components/Sidebar";
import Services from "./Admin_Components/Pages/Services";
import CreateService from "./Admin_Components/Pages/CreateService";
import EditService from "./Admin_Components/Pages/EditService";
import ServiceCategory from "./Admin_Components/Pages/Servicecategory";
import CreateServiceCategory from "./Admin_Components/Pages/CreateServiceCategory";
import EditServiceCategory from "./Admin_Components/Pages/EditServiceCategory";
import News from "./Admin_Components/Pages/News";
import CreateNews from "./Admin_Components/Pages/CreateNews";
import EditNews from "./Admin_Components/Pages/EditNews";
import NewsCategory from "./Admin_Components/Pages/NewsCategory";
import CreateNewsCategory from "./Admin_Components/Pages/CreateNewsCategory";
import EditNewsCategory from "./Admin_Components/Pages/EditNewsCategory";
import Testimonials from "./Admin_Components/Pages/Testimonials";
import CreateTestimonials from "./Admin_Components/Pages/CreateTestimonials";
import EditTestimonials from "./Admin_Components/Pages/EditTestimonials";
import FAQ from "./Admin_Components/Pages/FAQ";
import CreateFAQ from "./Admin_Components/Pages/CreateFAQ";
import EditFAQ from "./Admin_Components/Pages/EditFAQ";
import OurStaff from "./Admin_Components/Pages/Staff";
import CreateStaff from "./Admin_Components/Pages/CreateStaff";
import EditStaff from "./Admin_Components/Pages/EditStaff";
import Banner from "./Admin_Components/Pages/Banner";
import CreateBanner from "./Admin_Components/Pages/CreateBanner";
import EditBanner from "./Admin_Components/Pages/EditBanner";
import ProductCategory from "./Admin_Components/Pages/ProductCategory";
import CreateProductCategory from "./Admin_Components/Pages/CreateCategory";
import EditCategory from "./Admin_Components/Pages/EditCategory";
import PageContent from "./Admin_Components/Pages/PageContent";
import CreatePageContent from "./Admin_Components/Pages/CreatePageContent";
import Product from "./Admin_Components/Pages/Product";
import CreateProduct from "./Admin_Components/Pages/CreateProduct";
import EditProduct from "./Admin_Components/Pages/EditProduct";
import Partner from "./Admin_Components/Pages/Partners";
import CreatePartner from "./Admin_Components/Pages/CreatePartner";
import EditPartner from "./Admin_Components/Pages/EditPartner";
import Dashboard from "./Admin_Components/Pages/Dashboard";
import Signup from "./Admin_Components/Adminsignup";
import Login from "./Admin_Components/Adminlogin";
import VerifyOTP from "./Admin_Components/VerifyOTP";
import ResetPassword from "./Admin_Components/ResetPassword";
import EditPageContent from "./Admin_Components/Pages/EditPageContent";
import ForgetPassword from "./Admin_Components/ForgotPassword";
import DatabaseManagement from "./Admin_Components/Pages/DatabaseManagement";
import ManagePassword from "./Admin_Components/Pages/ManagePassword";
import Logo from "./Admin_Components/Pages/Logo";
import Cookies from "js-cookie";
import CreateAboutUsPoints from "./Admin_Components/Pages/CreateAboutuspoints";
import EditAboutUsPoints from "./Admin_Components/Pages/EditAboutuspoints";
import Achievements from "./Admin_Components/Pages/Achievements";
import CreateAchievements from "./Admin_Components/Pages/CreateAchievements";
import EditAchievement from "./Admin_Components/Pages/EditAchievements";
import Counter from "./Admin_Components/Pages/Counter";
import EditCounter from "./Admin_Components/Pages/EditCounter";
import CreateCounter from "./Admin_Components/Pages/CreateCounter";
import GalleryCategory from "./Admin_Components/Pages/GalleryCategory";
import EditGalleryCategory from "./Admin_Components/Pages/EditGalleryCategory";
import CreateGalleryCategory from "./Admin_Components/Pages/CreateGalleryCategory";
import Gallery from "./Admin_Components/Pages/Gallery";
import CreateGallery from "./Admin_Components/Pages/CreateGallery";
import EditGallery from "./Admin_Components/Pages/EditGallery";
import Inquiry from "./Admin_Components/Pages/Inquiry";
import Mission from "./Admin_Components/Pages/Mission";
import Vision from "./Admin_Components/Pages/Vision";
import Corevalue from "./Admin_Components/Pages/Corevalue";
import CreateCorevalue from "./Admin_Components/Pages/CreateCorevalue";
import EditCorevalue from "./Admin_Components/Pages/EditCorevalue";
import Aboutcompany from "./Admin_Components/Pages/Aboutcompany";
import Careeroption from "./Admin_Components/Pages/Careeroptions";
import CreateCareeroption from "./Admin_Components/Pages/CreateCareeroption";
import EditCareeroption from "./Admin_Components/Pages/EditCareeroption";
import Careerinquiry from "./Admin_Components/Pages/Careerinquiry";
import Footer from "./Admin_Components/Pages/Footer";
import Header from "./Admin_Components/Pages/Header";
import Globalpresence from "./Admin_Components/Pages/GlobalPresence";
import WhatsappSettings from "./Admin_Components/Pages/WhatsappSettings";
import GoogleSettings from "./Admin_Components/Pages/GoogleSettings";
import Menulisting from "./Admin_Components/Pages/Menulisting";
import CreateMenulisting from "./Admin_Components/Pages/CreateMenulisting";
import EditMenulisting from "./Admin_Components/Pages/EditMenulisting";
import Infrastructure from "./Admin_Components/Pages/Infrastructure";
import CreateInfrastructure from "./Admin_Components/Pages/CreateInfrastructure";
import EditInfrastructure from "./Admin_Components/Pages/EditInfrastructure";
import QualityControl from "./Admin_Components/Pages/QualityControl";
import CreateQualityControl from "./Admin_Components/Pages/CreateQualityControl";
import EditQualityControl from "./Admin_Components/Pages/EditQualityControl";
import Sitemap from "./Admin_Components/Pages/Sitemap";
import CreateSitemap from "./Admin_Components/Pages/CreateSitemap";
import EditSitemap from "./Admin_Components/Pages/EditSitemap";
import Metadetails from "./Admin_Components/Pages/Metadetails";
import EditMetadetails from "./Admin_Components/Pages/EditMetadetails";
import ManageProfile from "./Admin_Components/Pages/ManageProfile";
import MissionAndVision from "./Admin_Components/Pages/MissionAndVision";
import Benefits from "./Admin_Components/Pages/Benefits";
import CreateBenefits from "./Admin_Components/Pages/CreateBenefits";
import EditBenefits from "./Admin_Components/Pages/EditBenefits";
import ManageColor from "./Admin_Components/Pages/ManageColor";
import City from "./MyComponents/city/City"
import State from "./MyComponents/State/State"
import CustomerList from "./MyComponents/customer/Customer";
import CreateCustomer from "./MyComponents/customer/AddCustomer";
import UpdateCustomer from "./MyComponents/customer/UpdateCustomer";
import Industries from "./MyComponents/indutry/Industry_Info";
import CreateCompanyForm from "./MyComponents/indutry/industryForm";
import CountryForm from "./MyComponents/country/countyForm";
import CountryList from "./MyComponents/country/country";
import UpdateCountryForm from "./MyComponents/country/updateCountry";
import StateForm from "./MyComponents/State/StateForm";
import UpdateForm from "./MyComponents/State/UpdateState";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      setIsLoggedIn(true);
    } else {
      console.log("User is not logged in");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/verifyOTP" element={<VerifyOTP />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
          </>
        ) : (
          <Route path="/" element={<Sidebar />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/city" element={<City />} />
            <Route path="/state" element={<State />} />
            <Route path="/customer" element={<CustomerList />} />
            <Route path="/create-customer" element={<CreateCustomer />} />
            <Route path="/edit-customer/:id" element={<UpdateCustomer />} />
            <Route path="/industry" element={<Industries />} />
            <Route path="/create-company" element={<CreateCompanyForm />} />
            <Route path="/create-country" element={<CountryForm />} />
            <Route path="/country" element={<CountryList />} />
            <Route path="/update-country/:slug" element={<UpdateCountryForm />} />
            <Route path="/create-state" element={<StateForm />} />
            <Route path="/state/:slug" element={<UpdateForm />} />
           <Route
              path="/services/createServices"
              element={<CreateService />}
            />
            <Route
              path="/services/editServices/:slugs"
              element={<EditService />}
            />
            <Route path="/ServiceCategory" element={<ServiceCategory />} />
            <Route
              path="/ServiceCategory/CreateServiceCategory"
              element={<CreateServiceCategory />}
            />
            <Route
              path="/ServiceCategory/editServiceCategory/:categoryId/:subCategoryId?/:subSubCategoryId?"
              element={<EditServiceCategory />}
            />
            <Route path="/news" element={<News />} />
            <Route path="/news/createNews" element={<CreateNews />} />
            <Route path="/news/editNews/:slugs" element={<EditNews />} />
            <Route path="/NewsCategory" element={<NewsCategory />} />
            <Route
              path="/NewsCategory/CreateNewsCategory"
              element={<CreateNewsCategory />}
            />
            <Route
              path="/NewsCategory/editNewsCategory/:categoryId/:subCategoryId?/:subSubCategoryId?"
              element={<EditNewsCategory />}
            />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route
              path="/testimonials/createTestimonials"
              element={<CreateTestimonials />}
            />
            <Route
              path="/testimonials/editTestimonials/:id"
              element={<EditTestimonials />}
            />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/faq/createFAQ" element={<CreateFAQ />} />
            <Route path="/faq/editFAQ/:id" element={<EditFAQ />} />
            <Route path="/ourTeam" element={<OurStaff />} />
            <Route path="/ourTeam/createTeam" element={<CreateStaff />} />
            <Route path="/ourTeam/editTeam/:id" element={<EditStaff />} />
            <Route path="/banner" element={<Banner />} />
            <Route path="/banner/createBanner" element={<CreateBanner />} />
            <Route path="/banner/editBanner/:id" element={<EditBanner />} />
            <Route path="/ProductCategory" element={<ProductCategory />} />
            <Route
              path="/ProductCategory/CreateProductCategory"
              element={<CreateProductCategory />}
            />
            <Route
              path="/ProductCategory/editProductCategory/:categoryId/:subCategoryId?/:subSubCategoryId?"
              element={<EditCategory />}
            />
            <Route path="/extrapages" element={<PageContent />} />
            <Route
              path="/extrapages/createextrapages"
              element={<CreatePageContent />}
            />
            <Route
              path="/extrapages/editextrapages/:id"
              element={<EditPageContent />}
            />
            <Route
              path="/pageContent/createPoints"
              element={<CreateAboutUsPoints />}
            />
            <Route
              path="/pageContent/editPoints/:id"
              element={<EditAboutUsPoints />}
            />
            <Route path="/product" element={<Product />} />
            <Route path="/product/createProduct" element={<CreateProduct />} />
            <Route
              path="/product/editProduct/:slugs"
              element={<EditProduct />}
            />
            <Route path="/clients" element={<Partner />} />
            <Route path="/clients/createClients" element={<CreatePartner />} />
            <Route path="/clients/editClients/:id" element={<EditPartner />} />
            <Route path="/manageLogo" element={<Logo />} />
            <Route
              path="/DatabaseManagement"
              element={<DatabaseManagement />}
            />
            <Route path="/managePassword" element={<ManagePassword />} />
            <Route path="/manageProfile" element={<ManageProfile />} />
            <Route path="/certificates" element={<Achievements />} />
            <Route
              path="/certificates/createcertificates"
              element={<CreateAchievements />}
            />
            <Route
              path="/certificates/editcertificates/:id"
              element={<EditAchievement />}
            />
            <Route path="/counter" element={<Counter />} />
            <Route path="/counter/editCounter/:id" element={<EditCounter />} />
            <Route path="/counter/createCounter" element={<CreateCounter />} />
            <Route path="/Inquiry" element={<Inquiry />} />
            <Route path="/GalleryCategory" element={<GalleryCategory />} />
            <Route
              path="/GalleryCategory/editGalleryCategory/:id"
              element={<EditGalleryCategory />}
            />
            <Route
              path="/GalleryCategory/CreateGalleryCategory"
              element={<CreateGalleryCategory />}
            />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/createGallery" element={<CreateGallery />} />
            <Route path="/gallery/EditGallery/:id" element={<EditGallery />} />
            {/* <Route path="/mission" element={<Mission />} />
            <Route path="/vision" element={<Vision />} />  */}
            <Route path="/missionandvision" element={<MissionAndVision />} />
            <Route path="/corevalue" element={<Corevalue />} />
            <Route
              path="/corevalue/createCorevalue"
              element={<CreateCorevalue />}
            />
            <Route
              path="/corevalue/editCorevalue/:id"
              element={<EditCorevalue />}
            />
            <Route path="/aboutcompany" element={<Aboutcompany />} />
            <Route path="/careeroption" element={<Careeroption />} />
            <Route
              path="/careeroption/createCareerOption"
              element={<CreateCareeroption />}
            />
            <Route
              path="/careeroption/editCareerOption/:id"
              element={<EditCareeroption />}
            />
            <Route path="/careerinquiry" element={<Careerinquiry />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/header" element={<Header />} />
            <Route path="/globalpresence" element={<Globalpresence />} />
            <Route path="/whatsappSettings" element={<WhatsappSettings />} />
            <Route path="/googleSettings" element={<GoogleSettings />} />
            <Route path="/menulisting" element={<Menulisting />} />
            <Route
              path="/menulisting/createMenulisting"
              element={<CreateMenulisting />}
            />
            <Route
              path="/menulisting/editMenulisting/:id"
              element={<EditMenulisting />}
            />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route
              path="/infrastructure/createInfrastructure"
              element={<CreateInfrastructure />}
            />
            <Route
              path="/infrastructure/editInfrastructure/:id"
              element={<EditInfrastructure />}
            />
            <Route path="/qualitycontrol" element={<QualityControl />} />
            <Route
              path="/qualitycontrol/createQualitycontrol"
              element={<CreateQualityControl />}
            />
            <Route
              path="/qualitycontrol/editQualitycontrol/:id"
              element={<EditQualityControl />}
            />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/sitemap/createSitemap" element={<CreateSitemap />} />
            <Route
              path="/sitemap/editSitemap/:id/:type"
              element={<EditSitemap />}
            />
            <Route path="/metadetails" element={<Metadetails />} />
            <Route
              path="/metadetails/editmetaDetails/:id/:type"
              element={<EditMetadetails />}
            />
            <Route path="/benefits" element={<Benefits />} />
            <Route
              path="/benefits/createBenefits"
              element={<CreateBenefits />}
            />
            <Route
              path="/benefits/editBenefits/:id"
              element={<EditBenefits />}
            />
            <Route path="/manageTheme" element={<ManageColor />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
