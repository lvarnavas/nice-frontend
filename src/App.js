import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MainNavigation from "./shared/components/hooks.js/Navigation/MainNavigation";

import WarehouseStatus from "./products/pages/WarehouseStatus";
import SingleCarLoads from "./products/pages/loads/SingleCarLoads";
import TotalCarLoads from "./products/pages/loads/TotalCarLoads";
import SingleCarDestructions from "./products/pages/destructions/SingleCarDestructions";
import TotalCarDestructions from "./products/pages/destructions/TotalCarDestructions";
import WarehouseDestructions from "./products/pages/destructions/WarehouseDestructions";
import DailyCarDestructions from "./products/pages/destructions/DailyCarDestructions";
import SingleCarReturns from "./products/pages/returns/SingleCarReturns";
import TotalCarReturns from "./products/pages/returns/TotalCarReturns";
import AddNewLoad from "./products/pages/loads/AddNewLoad";
import AddNewReturn from "./products/pages/returns/AddNewReturn";
import AddNewDestruction from "./products/pages/destructions/AddNewCarDestruction";
import AddNewWarehouseDestruction from "./products/pages/destructions/AddNewWarehouseDestruction";
import NotFound from "./NotFound";
import SearchPage from './products/pages/searchpage';
import AddEntry from './products/pages/AddEntry';
import AccountPage from './products/pages/AccountPage';
import EditEntry from "./products/pages/EditEntry";

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <Switch>

        <Route path="/" exact>
          <WarehouseStatus />
        </Route>

        <Route path="/loads/single-car-loads">
          <SingleCarLoads />
        </Route>

        <Route path="/loads/total-car-loads">
          <TotalCarLoads />
        </Route>

        <Route path="/loads/add-new-load">
          <AddNewLoad />
        </Route>

        <Route path="/destructions/single-car-destructions">
          <SingleCarDestructions />
        </Route>

        <Route path="/destructions/total-car-destructions">
          <TotalCarDestructions />
        </Route>

        <Route path="/destructions/total-warehouse-destructions">
          <WarehouseDestructions />
        </Route>

        <Route path="/destructions/daily-car-destructions">
          <DailyCarDestructions />
        </Route>

        <Route path="/destructions/add-new-destruction">
          <AddNewDestruction />
        </Route>

        <Route path="/destructions/add-new-warehouse-destruction">
          <AddNewWarehouseDestruction />
        </Route>

        <Route path="/returns/single-car-returns">
          <SingleCarReturns />
        </Route>

        <Route path="/returns/total-car-returns">
          <TotalCarReturns />
        </Route>

        <Route path="/returns/add-new-return">
          <AddNewReturn />
        </Route>

        <Route path="/search" component={SearchPage} />
       
        <Route path="/addentry" component={AddEntry} />

        <Route path="/editentry" component={EditEntry} />
        
        <Route path="/account" component={AccountPage} />
        
        <Route>
          <NotFound />
        </Route>

        

      </Switch>
    </Router>
  );
};

export default App;
