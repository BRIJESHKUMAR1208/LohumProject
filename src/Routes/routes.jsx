import { Route, Routes } from "react-router-dom";
import Dashboard from "../Components/Dashboard/Dashboard";
import CreateMenu from "../Components/Admin/Menu/CreateMenu";
import CreateDepartment from "../Components/Admin/Department/CreateDepartment";
import AllDepartments from "../Components/Admin/Department/AllDepartment";
import ApprovalList from "../Components/Admin/Department/DepartmentTable/ApprovalList";
import PublisherList from "../Components/Admin/Department/DepartmentTable/PublisherList";

import { EditDepartment } from "../Components/Admin/Department/EditDepartment";
import ApproverEdit from "../Components/Admin/Department/DepartmentEdit/ApproverEdit";
import PublishDeptEdit from "../Components/Admin/Department/DepartmentEdit/PublishDeptEdit";

import CreateCourse from "../Components/Admin/Course/CreateCourse";
import MenuSubMenu from "../Components/Admin/MenuSubMenu/MenuSubMenu";
import EditMenu from "../Components/Admin/EditMenuSubmeu/EditMenu";
import EditSubMenu from "../Components/Admin/EditMenuSubmeu/EditSubmenu";
import CreateSubMenu from "../Components/Admin/SubMenu/CreateSubMenu";
import Custom from "../Components/Admin/custom/custom";
import CustomTable from "../Components/Admin/custom/CustomTable";
import Editcustomdata from "../Components/Admin/custom/Editcustomdata";
import Banner from "../Components/Admin/Banner/Banner";
import Candidate from "../Components/Admin/Candidate/Candidate";
import CreateWhatsNew from "../Components/Admin/WhatsNew/CreateWhatsNew/CreateWhatsNew";
import IndexEdit from "../Components/Admin/EditMenuSubmeu/IndexEdit";
import AllCourses from "../Components/Admin/Course/AllCourses";
import EditCourse from "../Components/Admin/Course/EditCourse";
import AllCandidates from "../Components/Admin/Candidate/AllCandidates";
import EditCandidate from "../Components/Admin/Candidate/EditCandidate";
import CreateHostel from "../Components/Admin/Hostel/CreateHostel";
import AllHostel from "../Components/Admin/Hostel/AllHostel";
import EditHostel from "../Components/Admin/Hostel/EditHostel";

import CreateRoom from "../Components/Admin/Rooms/CreateRoom";
import AllRooms from "../Components/Admin/Rooms/AllRooms";
import EditRoom from "../Components/Admin/Rooms/EditRoom";
import Approvallist from "../Components/Admin/MenuSubMenu/Approvallist";
import Approvedata from "../Components/Admin/EditMenuSubmeu/approvedata";
import Publisherlist from "../Components/Admin/MenuSubMenu/Publisherlist";
import Publishdata from "../Components/Admin/EditMenuSubmeu/Publishdata";
import Customapprovallist from "../Components/Admin/custom/Customapprovallist";
import Editcustomapproval from "../Components/Admin/custom/Editcustomapproval";
import Custompublisherlist from "../Components/Admin/custom/Custompublisherlist";
import Editpublisherapproval from "../Components/Admin/custom/Editcustompublisher";
import Index from "../Components/Admin/EditMenuSubmeu/IndexEdit";
import Approvaledit from "../Components/Admin/EditMenuSubmeu/Approvalindex";
import Publishindex from "../Components/Admin/EditMenuSubmeu/Publishindex";
import BannerTable from "../Components/Admin/Banner/BannerTable";
import Approvebanner from "../Components/Admin/Banner/Approvebanner";
import WhatsNewTable from "../Components/Admin/WhatsNew/WhtasNewTable/WhatsNewTable";
import EditWhatsNew from "../Components/Admin/WhatsNew/EditWhatsNew/EditWhatsNew";
import Createtender from "../Components/Admin/Tender/CreateTender/Createtender";
import TenderTable from "../Components/Admin/Tender/TenderTable/TenderTable";
import EditTender from "../Components/Admin/Tender/EditTender/EditTender";

import WhatsNewapprovalTable from "../Components/Admin/WhatsNew/WhtasNewTable/Whatsnewapprovallist";
import WhatsNewpublisherTable from "../Components/Admin/WhatsNew/WhtasNewTable/Whatsnewpublisherlist";
import ApproveWhatsNew from "../Components/Admin/WhatsNew/EditWhatsNew/Approvewhatsnew";
import PublisWhatsNew from "../Components/Admin/WhatsNew/EditWhatsNew//Publishwhatsnew";
import Bookroom from "../Components/Admin/BookRoom/Bookroom";
import Bookroomlist from "../Components/Admin/BookRoom/Bookroomlist";
import TenderPublisherlist from "../Components/Admin/Tender/TenderTable/Tenderpublisherlist";
import TenderApprovallist from "../Components/Admin/Tender/TenderTable/Tenderapporvallist";
import ApproveTender from "../Components/Admin/Tender/EditTender/Edittenderapproval";
import PublisherTender from "../Components/Admin/Tender/EditTender/Edittenderpublish";
import EditBookRoom from "../Components/Admin/BookRoom/EditBookRoom";

import ApprovalbannerList from "../Components/Admin/Banner/Approvebannerlist";
import PublisherbannerList from "../Components/Admin/Banner/Bannerpublisherlist";
import Publishbanner from "../Components/Admin/Banner/Publishbannerdata";
import CreateFooterAddress from "../Components/Admin/CMSFooter/CreateFooter/CreateFooterAddress";
import CreateFooterData from "../Components/Admin/CMSFooter/CreateFooter/CreateFooterData";
import CreateFooterDec from "../Components/Admin/CMSFooter/CreateFooter/CreateFooterDec";
import CreateFooterServices from "../Components/Admin/CMSFooter/CreateFooter/CreateFooterServices";
import EditFooterDec from "../Components/Admin/CMSFooter/EditFooter/EditFooterDec";
import EditFooterServices from "../Components/Admin/CMSFooter/EditFooter/EditFooterServices";
import EditFooterData from "../Components/Admin/CMSFooter/EditFooter/EditFooterData";
import EditFooterAddress from "../Components/Admin/CMSFooter/EditFooter/EditFooterAddress";
import IndexEditFooter from "../Components/Admin/CMSFooter/EditFooter/IndexEditFooter";
import FooterTable from "../Components/Admin/CMSFooter/FooterTable/FooterTable";
import ApproveindexFooter from "../Components/Admin/CMSFooter/EditFooter/indexapprovefooter";
import PublishindexFooter from "../Components/Admin/CMSFooter/EditFooter/indexpublishfooter";
import PublisherFooterTable from "../Components/Admin/CMSFooter/FooterTable/Publishfooterlist";
import ApproveFooterTable from "../Components/Admin/CMSFooter/FooterTable/Approvalfooterlist";
import CircularForm from "../Components/Admin/Circular/CircularForm";
import CircularTable from "../Components/Admin/Circular/CircularTable";
import EditCircular from "../Components/Admin/Circular/EditCircular";
import ApproveCircularTable from "../Components/Admin/Circular/Approvecircularlist";
import PublishCircularTable from "../Components/Admin/Circular/Publishcircularlist";
import ApproveCircular from "../Components/Admin/Circular/Approvecircular";
import PublisheCircular from "../Components/Admin/Circular/Publishcirculardata";
import CreateUser from "../Components/Admin/User/CreateUser";
import UserTable from "../Components/Admin/User/UserTable";
import LoginForm from "../Components/Admin/Login/LoginForm";
import EditUser from "../Components/Admin/User/EditUser";
import ApprovehosttalTable from "../Components/Admin/Hostel/Approvalhostallist";
import ApproverEditHostel from "../Components/Admin/Hostel/ApproverEditHostel";
import PublishHostalTable from "../Components/Admin/Hostel/Publishhostallist";
import Publishedithostal from "../Components/Admin/Hostel/Publishedithostal";
import Approvalroomlist from "../Components/Admin/Rooms/Approvalroomlist";
import ApprovalEditRoom from "../Components/Admin/Rooms/ApprovalEditRoom";
import Publisherroomlist from "../Components/Admin/Rooms/Publisherroomlist";
import PublisherEditRoom from "../Components/Admin/Rooms/PublisherEditRoom";
import AprovalBookroomlist from "../Components/Admin/BookRoom/AprovalBookroomlist";
import ApprovalEditBookRoom from "../Components/Admin/BookRoom/ApprovalEditBookRoom";
import PublisherBookroomlist from "../Components/Admin/BookRoom/PublisherBookroomlist";
import Approvalcandidatelist from "../Components/Admin/Candidate/Approvalcandidatelist";
import ApprovalEditCandidate from "../Components/Admin/Candidate/ApprovalEditCandidate";
import Publishcandidatelist from "../Components/Admin/Candidate/Publishcandidatelist";
import PublisherEditCandidate from "../Components/Admin/Candidate/PublisherEditCandidate";
import CourseApproveList from "../Components/Admin/Course/CourseApproveList";
import CoursePublishList from "../Components/Admin/Course/CoursePublishList";
import EditCourseApprove from "../Components/Admin/Course/EditCourseApprove";
import EditCoursePublish from "../Components/Admin/Course/EditCoursePublish";
import LogoSliderForm from "../Components/Admin/logoSlider/LogoSliderForm";
import LogoSliderTable from "../Components/Admin/logoSlider/LogoSliderTable";
import ApproveList from "../Components/Admin/logoSlider/ApproveList";
import PublishList from "../Components/Admin/logoSlider/PublishList";
import EditApproveLogo from "../Components/Admin/logoSlider/EditApproveLogo";
import EditPushlishLogo from "../Components/Admin/logoSlider/EditPublishLogo";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cms/Createmenu" element={<CreateMenu />} />
      <Route path="/Department/DepartmentForm" element={<CreateDepartment />} />
      <Route path="/MenuSubMenu/MenuSubMenu" element={<MenuSubMenu />} />
      <Route path="/EditMenuSubmeu/EditMenu/:id" element={<EditMenu />} />
      <Route path="/EditMenuSubmeu/EditSubMenu/:id" element={<EditSubMenu />} />
      <Route path="/SubMenu/CreateSubMenu" element={<CreateSubMenu />} />
      <Route path="/custom/custom" element={<Custom />} />
      <Route path="/Department/AllDepartment" element={<AllDepartments />} />
      <Route path="/Department/ApprovalList" element={<ApprovalList />} />
      <Route path="/Department/PublisherList" element={<PublisherList />} />
      <Route
        path="/Department/EditDepartment/:id"
        element={<EditDepartment />}
      />
      <Route path="/Department/ApproverEdit/:id" element={<ApproverEdit />} />
      <Route
        path="/Department/PublishDeptEdit/:id"
        element={<PublishDeptEdit />}
      />
      <Route path="/Course/CreateCourse" element={<CreateCourse />} />
      <Route path="/Candidate/CreateCandidate" element={<Candidate />} />
      <Route path="/custom/CustomTable" element={<CustomTable />} />
      <Route path="/custom/Editcustomdata/:id" element={<Editcustomdata />} />
      <Route path="/Banner/Banner" element={<Banner />} />
      <Route path="/Course/AllCourse" element={<AllCourses />} />
      <Route path="/Course/CourseApproveList" element={<CourseApproveList />} />
      <Route
        path="/Course/EditCourseApprove/:id"
        element={<EditCourseApprove />}
      />
      <Route
        path="/Course/EditCoursePublish/:id"
        element={<EditCoursePublish />}
      />
      <Route
        path="/Course/CoursePublisherList"
        element={<CoursePublishList />}
      />
      <Route path="/Course/EditCourse/:id" element={<EditCourse />} />
      <Route path="/approvallist" element={<Approvallist />} />
      <Route path="/publisherlist" element={<Publisherlist />} />
      <Route path="/menu/approval/:id" element={<Approvedata />} />
      <Route path="/menu/publish/:id" element={<Publishdata />} />
      <Route path="/approvallist" element={<Approvallist />} />
      <Route path="/publisherlist" element={<Publisherlist />} />
      <Route path="/menu/approval/:id" element={<Approvedata />} />
      <Route path="/menu/publish/:id" element={<Publishdata />} />
      <Route path="/WhatsNew/CreateWhatsNew" element={<CreateWhatsNew />} />
      <Route path="/EditMenuSubmeu/IndexEdit/:id" element={<IndexEdit />} />

      <Route path="/WhatsNew/WhatsNewTable" element={<WhatsNewTable />} />
      <Route path="/WhatsNew/EditWhatsNew/:id" element={<EditWhatsNew />} />

      <Route path="/customapproval" element={<Customapprovallist />} />
      <Route path="/customapproval/:id" element={<Editcustomapproval />} />
      <Route path="/customapproval/:id" element={<Editcustomapproval />} />
      <Route path="/custompublisher" element={<Custompublisherlist />} />
      <Route path="/publishdata/:id" element={<Editpublisherapproval />} />
      <Route path="/publishdata/:id" element={<Editpublisherapproval />} />
      <Route path="editdata/:id" element={<Index />} />
      <Route path="approvaleditdata/:id" element={<Approvaledit />} />
      <Route path="publishdataindex/:id" element={<Publishindex />} />
      <Route path="/Candidate/AllCandidates" element={<AllCandidates />} />
      <Route path="/Candidate/EditCandidate/:id" element={<EditCandidate />} />

      {/* Hostal */}
      <Route path="/Hostel/CreateHostel" element={<CreateHostel />} />
      <Route path="/Hostel/AllHostel" element={<AllHostel />} />
      <Route path="/Hostel/EditHostel/:id" element={<EditHostel />} />
      <Route path="/Approvalhostallist" element={<ApprovehosttalTable />} />
      <Route path="/approveedithostal/:id" element={<ApproverEditHostel />} />
      <Route path="/Publisherhostallist" element={<PublishHostalTable />} />
      <Route path="/Publishedithostal/:id" element={<Publishedithostal />} />

      {/* <Route path="/Publisherfooterlist" element={<PublisherFooterTable />} /> */}

      <Route path="/BookRoom/Bookroom" element={<Bookroom />} />
      <Route path="/BookRoom/Bookroomlist" element={<Bookroomlist />} />
      <Route path="/BookRoom/EditBookRoom/:id" element={<EditBookRoom />} />
      <Route path="/AprovalBookroomlist" element={<AprovalBookroomlist />} />
      <Route
        path="/ApprovalEditBookRoom/:id"
        element={<ApprovalEditBookRoom />}
      />
      <Route
        path="/PublisherBookroomlist"
        element={<PublisherBookroomlist />}
      />

      <Route path="/bannerdata" element={<BannerTable />} />
      <Route path="/Candidate/AllCandidates" element={<AllCandidates />} />
      <Route path="/Candidate/EditCandidate/:id" element={<EditCandidate />} />
      <Route
        path="/Approvalcandidatelist"
        element={<Approvalcandidatelist />}
      />
      <Route
        path="/Candidate/ApprovalEditCandidate/:id"
        element={<ApprovalEditCandidate />}
      />
      <Route path="/Publishcandidatelist" element={<Publishcandidatelist />} />
      <Route
        path="/Candidate/PublisherEditCandidate/:id"
        element={<PublisherEditCandidate />}
      />

      <Route path="/Hostel/CreateHostel" element={<CreateHostel />} />
      <Route path="/Hostel/AllHostel" element={<AllHostel />} />
      {/* <Route path="/Hostel/EditHostel/:id" element={<EditHostel />} /> */}
      <Route path="/WhatsNewapprovallist" element={<WhatsNewapprovalTable />} />
      <Route
        path="/WhatsNewpublisherlist"
        element={<WhatsNewpublisherTable />}
      />
      <Route path="/ApproveWhatsNewdata/:id" element={<ApproveWhatsNew />} />
      <Route path="/PublishWhatsNewdata/:id" element={<PublisWhatsNew />} />
      <Route path="/approvebanner/:id" element={<Approvebanner />} />

      <Route path="/Candidate/AllCandidates" element={<AllCandidates />} />
      <Route path="/Candidate/EditCandidate/:id" element={<EditCandidate />} />
      <Route path="/Hostel/CreateHostel" element={<CreateHostel />} />
      <Route path="/Hostel/AllHostel" element={<AllHostel />} />
      <Route path="/Hostel/EditHostel/:id" element={<EditHostel />} />

      <Route path="/WhatsNew/WhatsNewTable" element={<WhatsNewTable />} />
      <Route path="/WhatsNew/EditWhatsNew/:id" element={<EditWhatsNew />} />
      <Route path="/CreateTender/Createtender" element={<Createtender />} />
      <Route path="/TenderTable/TenderTable" element={<TenderTable />} />
      <Route path="/EditTender/EditTender/:id" element={<EditTender />} />
      <Route path="/Tenderapprovallist" element={<TenderApprovallist />} />
      <Route path="/Tenderpublisherlist" element={<TenderPublisherlist />} />
      <Route path="/ApproveTenderdata/:id" element={<ApproveTender />} />
      <Route path="/PublishTenderdata/:id" element={<PublisherTender />} />
      {/* Allroom */}
      <Route path="/Rooms/CreateRoom" element={<CreateRoom />} />
      <Route path="/Rooms/AllRooms" element={<AllRooms />} />
      <Route path="/Room/EditRoom/:id" element={<EditRoom />} />
      <Route path="/Approvalroomlist" element={<Approvalroomlist />} />
      <Route path="/ApprovalEditRoom/:id" element={<ApprovalEditRoom />} />
      <Route path="/Publisherroomlist" element={<Publisherroomlist />} />
      <Route path="/PublisherEditRoom/:id" element={<PublisherEditRoom />} />

      <Route path="/bannerapprovallist" element={<ApprovalbannerList />} />
      <Route path="/bannerpublisherlist" element={<PublisherbannerList />} />
      <Route path="/publishbannerdata/:id" element={<Publishbanner />} />
      {/* <Route path="/Login/LoginForm" element={<LoginForm />} /> */}

      {/* CMSFooter */}
      <Route
        path="/CMSFooter/CreateFooter/CreateFooterAddress"
        element={<CreateFooterAddress />}
      />
      <Route
        path="/CMSFooter/CreateFooter/CreateFooterData"
        element={<CreateFooterData />}
      />
      <Route
        path="/CMSFooter/CreateFooter/CreateFooterDec"
        element={<CreateFooterDec />}
      />
      <Route
        path="/CMSFooter/CreateFooter/CreateFooterServices"
        element={<CreateFooterServices />}
      />
      <Route
        path="/CMSFooter/EditFooter/EditFooterDec/:id"
        element={<EditFooterDec />}
      />
      <Route
        path="/CMSFooter/EditFooter/EditFooterServices/:id"
        element={<EditFooterServices />}
      />
      <Route
        path="/CMSFooter/EditFooter/EditFooterData/:id"
        element={<EditFooterData />}
      />
      <Route
        path="/CMSFooter/EditFooter/EditFooterAddress/:id"
        element={<EditFooterAddress />}
      />
      <Route
        path="/CMSFooter/EditFooter/IndexEditFooter/:id"
        element={<IndexEditFooter />}
      />
      <Route
        path="/CMSFooter/FooterTable/FooterTable"
        element={<FooterTable />}
      />
      <Route path="/approvefooterdata/:id" element={<ApproveindexFooter />} />
      <Route path="/PublishindexFooter/:id" element={<PublishindexFooter />} />
      <Route path="/Publisherfooterlist" element={<PublisherFooterTable />} />
      <Route path="/Approvalfooterlist" element={<ApproveFooterTable />} />
      <Route
        path="/CMSFooter/EditFooter/IndexEditFooter/:id"
        element={<IndexEditFooter />}
      />
      <Route
        path="/CMSFooter/FooterTable/FooterTable"
        element={<FooterTable />}
      />

      {/* Circular */}
      <Route path="/Circular/CircularForm" element={<CircularForm />} />
      <Route path="/Circular/CircularTable" element={<CircularTable />} />
      <Route path="/Circular/EditCircular/:id" element={<EditCircular />} />
      <Route path="/approvecirculardata" element={<ApproveCircularTable />} />
      <Route path="/publishcirculardata" element={<PublishCircularTable />} />
      <Route path="/approvecircular/:id" element={<ApproveCircular />} />
      <Route path="/publishcircular/:id" element={<PublisheCircular />} />

      {/* User */}
      <Route path="/User/CreateUser" element={<CreateUser />} />
      <Route path="/User/UserTable" element={<UserTable />} />
      <Route path="/User/EditUser/:id" element={<EditUser />} />

      {/* {Logo Slider} */}
      <Route path="/logoSlider/LogoSliderForm" element={<LogoSliderForm />} />
      <Route path="/logoSlider/LogoSliderTable" element={<LogoSliderTable />} />
      <Route path="/logoSlider/ApproveList" element={<ApproveList />} />
      <Route path="/logoSlider/PublishList" element={<PublishList />} />
      <Route
        path="/logoSlider/EditApproveLogo/:id"
        element={<EditApproveLogo />}
      />
      <Route
        path="/logoSlider/EditPublishLogo/:id"
        element={<EditPushlishLogo />}
      />
    </Routes>
  );
}

export default Router;
