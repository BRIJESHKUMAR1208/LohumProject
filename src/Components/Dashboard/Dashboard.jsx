import React from "react";
import "./dashboard.scss";
import { Link } from "react-router-dom";

// Import Images
import relatedlink from "../../assets/img/link2.png";
import userimg from "../../assets/img/userdashboard.jpg";
import CMS from "../../assets/img/cms2.jpg";
import Footer from "../../assets/img/footer.png";
import WhatsNew from "../../assets/img/whatsnew.png";
import Banner from "../../assets/img/banner1.png";
import Profile from "../../assets/img/Profile.png";
import contact from "../../assets/img/contact.png";

// Dashboard Items Array
const dashboardItems = [
  { img: userimg, title: "User", className: "c1", link: "/User/UserTable" },
  { img: CMS, title: "CMS", className: "c2", link: "/MenuSubMenu/MenuSubMenu" },
  { img: Footer, title: "Footer", className: "c3", link: "/CMSFooter/FooterTable/FooterTable" },
  { img: WhatsNew, title: "Whats New", className: "c4", link: "/WhatsNew/WhatsNewTable" },
  { img: Banner, title: "Banner", className: "c5", link: "/bannerdata" },
  { img: relatedlink, title: "Tender ", className: "c6", link: "/TenderTable/TenderTable" },
  { img: Profile, title: "Candidate", className: "c7", link: "/Candidate/AllCandidates" },
  { img: contact, title: "Book Room", className: "c8", link: "/BookRoom/Bookroomlist" },
];

// Reusable Card Component
const DashboardCard = ({ img, title, className, link }) => (
  <div className="col">
    <Link to={link} className={`card cr-box ${className}`}>
      <img src={img} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
      </div>
    </Link>
  </div>
);

const Dashboard = () => {
  return (
    <div className="dashboard-container ">
      <main id="main" className="main">
        <div className="pagetitle ">
          <nav>
            <ol className="breadcrumb ">
              <li className="breadcrumb-item ">Home</li>
              <li className="breadcrumb-item active ">Dashboard</li>
            </ol>
          </nav>
        </div>

        <section className="section dashboard ">
          <div className="row row-cols-md-4 row-cols-2 g-3 test">
            {dashboardItems.map((item, index) => (
              <DashboardCard key={index} {...item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
