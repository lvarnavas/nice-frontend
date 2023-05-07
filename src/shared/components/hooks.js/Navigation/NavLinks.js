import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <nav>
      <ul className="navbar">
        {auth.isLoggedIn && (
          <li className="dropdown">
            <NavLink to="#" className="dropdown-btn">
              ΤΡΕΧΩΝ ΜΗΝΑΣ <span>▼</span>
            </NavLink>
            <div className="dropdown-content">
              <NavLink to="/loads/total-car-loads">ΦΟΡΤΩΜΑΤΑ</NavLink>
              <NavLink to="/destructions/total-car-destructions">
                ΚΑΤΑΣΤΡΟΦΕΣ ΟΧΗΜΑΤΩΝ
              </NavLink>
              <NavLink to="/destructions/total-warehouse-destructions">
                ΚΑΤΑΣΤΡΟΦΕΣ ΑΠΟΘΗΚΗΣ
              </NavLink>
              <NavLink to="/returns/total-car-returns">ΕΠΙΣΤΡΟΦΕΣ</NavLink>
            </div>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/search">ΑΝΑΖΗΤΗΣΗ</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/addentry">ΚΑΤΑΧΩΡΗΣΗ</NavLink>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <NavLink to="/auth">ΛΟΓΑΡΙΑΣΜΟΣ</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <button onClick={auth.logout}>LOG OUT</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavLinks;
