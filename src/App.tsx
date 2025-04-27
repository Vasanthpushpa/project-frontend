import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 2;
    const [sortOption, setSortOption] = useState('recent');

    useEffect(() => {
        document.documentElement.style.background = 'linear-gradient(to right, #6a11cb, #2575fc)';
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/projects')
            .then((response) => {
                setProjects(response.data);
            })
            .catch((error) => console.error('Error fetching projects:', error));
    }, []);

    const getSortedProjects = () => {
        let sorted = [...projects];
        switch (sortOption) {
            case 'usernameAsc':
                sorted.sort((a, b) => (a.username || '').localeCompare(b.username || ''));
                break;
            case 'titleAsc':
                sorted.sort((a, b) => (a.project_title || '').localeCompare(b.project_title || ''));
                break;
            case 'recent':
            default:
                sorted = [...projects];
                break;
        }
        return sorted;
    };

    const sortedProjects = getSortedProjects();
    const indexOfLastProject = currentPage * rowsPerPage;
    const indexOfFirstProject = indexOfLastProject - rowsPerPage;
    const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(sortedProjects.length / rowsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
    }, [sortOption]);

    return (
        <div className="container" style={styles.container}>
            <h2 style={styles.header}>Projects List</h2>

            <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={styles.select}
            >
                <option value="recent">Recent Projects</option>
                <option value="usernameAsc">Order By Username</option>
                <option value="titleAsc">Order By Project Title</option>
            </select>

            <table border={1} width="100%" style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Project Title</th>
                        <th style={styles.tableHeader}>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProjects.length > 0 ? (
                        currentProjects.map((proj, index) => (
                            <tr key={index}>
                                <td style={styles.tableData}>{proj.project_title || 'Untitled Project'}</td>
                                <td style={styles.tableData}>{proj.username || 'Unknown User'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" style={styles.noData}>No valid projects available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div style={styles.pagination}>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        style={currentPage === (i + 1) ? styles.activePage : styles.pageButton}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '"Poppins", sans-serif',
        color: '#333',
        animation: 'fadeIn 2s ease-out',
    },
    header: {
        textAlign: 'center',
        fontSize: '2.5rem',
        color: '#fff',
        marginBottom: '20px',
        fontWeight: '600',
    },
    select: {
        display: 'block',
        margin: '0 auto',
        padding: '12px',
        fontSize: '1rem',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '20px',
        transition: '0.3s',
    },
    table: {
        width: '100%',
        marginTop: '20px',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    },
    tableHeader: {
        backgroundColor: '#6a11cb',
        padding: '15px',
        textAlign: 'left',
        fontSize: '1.1rem',
        color: '#fff',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
    },
    tableData: {
        padding: '12px',
        textAlign: 'left',
        fontSize: '1rem',
        borderBottom: '1px solid #eee',
        transition: 'background-color 0.3s',
    },
    noData: {
        textAlign: 'center',
        padding: '20px',
        color: '#888',
        fontSize: '1.2rem',
    },
    pagination: {
        textAlign: 'center',
        marginTop: '20px',
    },
    pageButton: {
        padding: '8px 16px',
        margin: '0 5px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '50px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.3s, transform 0.3s',
    },
    activePage: {
        padding: '8px 16px',
        margin: '0 5px',
        backgroundColor: '#2575fc',
        border: '1px solid #2575fc',
        borderRadius: '50px',
        cursor: 'pointer',
        fontSize: '1rem',
        color: '#fff',
    },
    pageButtonHover: {
        backgroundColor: '#e0e0e0',
        transform: 'scale(1.1)',
    },
};

// Add the animation keyframes for fadeIn
const globalStyles = `
@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}
`;
document.styleSheets[0].insertRule(globalStyles, 0);

export default App;
