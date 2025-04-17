// import { useEffect } from "react";

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
// import NotFound from "./pages/OtherPage/NotFound";
// import AppLayout from "./layout/AppLayout";
// import { ScrollToTop } from "./components/common/ScrollToTop";
// import Home from "./pages/Dashboard/Home";

// // MODULES
// import SalesRoute from "./pages/Modules/SalesRoute";
// import MasterUser from "./pages/Modules/MasterUser";
// import MasterMenu from "./pages/Modules/MasterMenu";

// // Other Pages
// import UserProfiles from "./pages/UserProfiles";
// import Calendar from "./pages/Calendar";
// import Blank from "./pages/Blank";
// import FormElements from "./pages/Forms/FormElements";
// import BasicTables from "./pages/Tables/BasicTables";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import Images from "./pages/UiElements/Images";
// import Videos from "./pages/UiElements/Videos";

// // ✅ Import ProtectedRoute
// import ProtectedRoute from "./context/ProtectedRoute";

// import { useMenuStore } from '../src/API/store/masterMenuStore';


// export function AppRoutes() {

//     const { fetchMenus, menus } = useMenuStore();

//     useEffect(() => {
//         fetchMenus();
//     }, [fetchMenus]);


//     useEffect(() => {
//         console.log('menus', menus);
//     }, [menus]);

//     return (
//         <Router>
//             <ScrollToTop />
//             <Routes>
//                 {/* ✅ Protected Layout dengan token */}
//                 <Route element={<ProtectedRoute />}>
//                     <Route element={<AppLayout />}>
//                         <Route index path="/dashboard" element={<Home />} />
//                         <Route path="/sales_route" element={<SalesRoute />} />
//                         <Route path="/master_user" element={<MasterUser />} />
//                         <Route path="/master_menu" element={<MasterMenu />} />
//                         <Route path="/profile" element={<UserProfiles />} />
//                         <Route path="/calendar" element={<Calendar />} />
//                         <Route path="/blank" element={<Blank />} />
//                         <Route path="/form-elements" element={<FormElements />} />
//                         <Route path="/basic-tables" element={<BasicTables />} />
//                         <Route path="/alerts" element={<Alerts />} />
//                         <Route path="/avatars" element={<Avatars />} />
//                         <Route path="/badge" element={<Badges />} />
//                         <Route path="/buttons" element={<Buttons />} />
//                         <Route path="/images" element={<Images />} />
//                         <Route path="/videos" element={<Videos />} />
//                         <Route path="/line-chart" element={<LineChart />} />
//                         <Route path="/bar-chart" element={<BarChart />} />
//                     </Route>
//                 </Route>

//                 {/* Auth Routes */}
//                 <Route path="/" element={<SignIn />} />
//                 <Route path="/signin" element={<SignIn />} />
//                 <Route path="/signup" element={<SignUp />} />

//                 {/* Not Found */}
//                 <Route path="*" element={<NotFound />} />
//             </Routes>
//         </Router>
//     );
// }
