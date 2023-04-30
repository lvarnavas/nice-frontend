import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = (props) => {
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/loads/total-car-loads">ΦΟΡΤΩΜΑΤΑ</NavLink>
      </li>
      <li>
        <NavLink to="/destructions/total-car-loads">
          ΚΑΤΑΣΤΡΟΦΕΣ ΟΧΗΜΑΤΩΝ
        </NavLink>
      </li>
      <li>
        <NavLink to="/destructions/total-warehouse-destructions">
          ΚΑΤΑΣΤΡΟΦΕΣ ΑΠΟΘΗΚΗΣ
        </NavLink>
      </li>
      <li>
        <NavLink to="/returns/total-car-returns">ΕΠΙΣΤΡΟΦΕΣ</NavLink>
      </li>
      <li>
        <NavLink to="/test">ΑΝΑΖΗΤΗΣΗ</NavLink>
      </li>
      <li>
        <NavLink to="/test">ΚΑΤΑΧΩΡΗΣΗ</NavLink>
      </li>
      <li>
        <NavLink to="/test">ΛΟΓΑΡΙΑΣΜΟΣ</NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
