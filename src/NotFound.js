import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
      <h2>Η σελίδα δεν βρέθηκε.</h2>
      <Link to="/">
        <button style={{ marginTop: '10px' }}>Επιστροφή στην αρχική</button>
      </Link>
    </div>
  );
};

export default NotFound;
