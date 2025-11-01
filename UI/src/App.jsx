import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Users,
  UserPlus,
  Search,
  BarChart3,
  Edit,
  Trash2,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
} from "lucide-react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [activeTab, setActiveTab] = useState("view");
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form states
  const [newStudent, setNewStudent] = useState({
    id: "",
    name: "",
    age: "",
    grade: "A",
    marks: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students`);
      setStudents(response.data.students || []);
    } catch (error) {
      showMessage("Error fetching students: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students/analyze`);
      setAnalytics(response.data);
    } catch (error) {
      showMessage("Error fetching analytics: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/students`, {
        id: parseInt(newStudent.id),
        name: newStudent.name,
        age: parseInt(newStudent.age),
        grade: newStudent.grade,
        marks: parseInt(newStudent.marks),
      });
      showMessage("Student added successfully!", "success");
      setNewStudent({ id: "", name: "", age: "", grade: "A", marks: "" });
      fetchStudents();
    } catch (error) {
      showMessage("Error adding student: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Search students
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students/search`, {
        params: { by: searchBy, value: searchQuery },
      });
      if (response.data.message) {
        setSearchResults([]);
        showMessage(response.data.message, "info");
      } else {
        setSearchResults([response.data]);
      }
    } catch (error) {
      showMessage("Error searching: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Update student
  const handleUpdateStudent = async (id, field, value) => {
    try {
      const updateData = {
        [field]:
          field === "id" || field === "age" || field === "marks"
            ? parseInt(value)
            : value,
      };
      await axios.put(`${API_BASE_URL}/students/${id}`, updateData);
      showMessage("Student updated successfully!", "success");
      fetchStudents();
    } catch (error) {
      showMessage("Error updating student: " + error.message, "error");
    }
  };

  // Delete student
  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/students/${id}`);
        showMessage("Student deleted successfully!", "success");
        fetchStudents();
      } catch (error) {
        showMessage("Error deleting student: " + error.message, "error");
      }
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    if (activeTab === "view") fetchStudents();
    if (activeTab === "analytics") fetchAnalytics();
  }, [activeTab, fetchStudents, fetchAnalytics]);

  return (
    <div className="app" style={{ maxWidth: "100%", margin: "0 auto" }}>
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <GraduationCap size={32} className="logo-icon" />
            <h1>Smart Student Management System</h1>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <Users size={20} />
              <span>{students.length} Students</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        <button
          className={`tab ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          <Users size={18} />
          View Students
        </button>
        <button
          className={`tab ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          <UserPlus size={18} />
          Add Student
        </button>
        <button
          className={`tab ${activeTab === "search" ? "active" : ""}`}
          onClick={() => setActiveTab("search")}
        >
          <Search size={18} />
          Search
        </button>
        <button
          className={`tab ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 size={18} />
          Analytics
        </button>
      </nav>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <main className="main-content">
        {/* View Students Tab */}
        {activeTab === "view" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>All Students</h2>
              <button onClick={fetchStudents} className="refresh-btn">
                <BookOpen size={16} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>No students found. Add some students to get started!</p>
              </div>
            ) : (
              <div className="students-grid">
                {students.map((student) => (
                  <div key={student.id} className="student-card">
                    <div className="student-header">
                      <h3>{student.name}</h3>
                      <span
                        className={`grade-badge grade-${student.grade.toLowerCase()}`}
                      >
                        {student.grade}
                      </span>
                    </div>
                    <div className="student-details">
                      <div className="detail-item">
                        <span className="label">ID:</span>
                        <span className="value">{student.id}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Age:</span>
                        <span className="value">{student.age} years</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Marks:</span>
                        <span className="value marks">{student.marks}/100</span>
                      </div>
                    </div>
                    <div className="student-actions">
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          const newValue = prompt(
                            `Update ${student.name}'s marks:`,
                            student.marks
                          );
                          if (newValue)
                            handleUpdateStudent(student.id, "marks", newValue);
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() =>
                          handleDeleteStudent(student.id, student.name)
                        }
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Student Tab */}
        {activeTab === "add" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Add New Student</h2>
            </div>

            <form onSubmit={handleAddStudent} className="add-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Student ID *</label>
                  <input
                    type="number"
                    value={newStudent.id}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, id: e.target.value })
                    }
                    required
                    placeholder="Enter unique ID"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    required
                    placeholder="Enter student name"
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    value={newStudent.age}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, age: e.target.value })
                    }
                    required
                    min="1"
                    max="150"
                    placeholder="Age"
                  />
                </div>
                <div className="form-group">
                  <label>Grade *</label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, grade: e.target.value })
                    }
                    required
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Marks *</label>
                  <input
                    type="number"
                    value={newStudent.marks}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, marks: e.target.value })
                    }
                    required
                    min="0"
                    max="100"
                    placeholder="0-100"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="submit-btn">
                <UserPlus size={16} />
                {loading ? "Adding..." : "Add Student"}
              </button>
            </form>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Search Students</h2>
            </div>

            <div className="search-form">
              <div className="search-controls">
                <select
                  value={searchBy}
                  style={{ backgroundColor: "gray" }}
                  onChange={(e) => setSearchBy(e.target.value)}
                >
                  <option value="name">Search by Name</option>
                  <option value="id">Search by ID</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Enter ${searchBy}...`}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button onClick={handleSearch} disabled={loading}>
                  <Search size={16} />
                  Search
                </button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                <h3>Search Results</h3>
                <div className="students-grid">
                  {searchResults.map((student) => (
                    <div key={student.id} className="student-card">
                      <div className="student-header">
                        <h3>{student.name}</h3>
                        <span
                          className={`grade-badge grade-${student.grade.toLowerCase()}`}
                        >
                          {student.grade}
                        </span>
                      </div>
                      <div className="student-details">
                        <div className="detail-item">
                          <span className="label">ID:</span>
                          <span className="value">{student.id}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Age:</span>
                          <span className="value">{student.age} years</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Marks:</span>
                          <span className="value marks">
                            {student.marks}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Data Analytics</h2>
              <button onClick={fetchAnalytics} className="refresh-btn">
                <TrendingUp size={16} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading analytics...</div>
            ) : analytics && !analytics.message ? (
              <div className="analytics-grid">
                <div className="analytics-card highlight">
                  <div className="card-header">
                    <Award size={24} />
                    <h3>Top Performer</h3>
                  </div>
                  <div className="card-content">
                    <div className="big-number">
                      {analytics.top_performer?.name || "N/A"}
                    </div>
                    <div className="subtitle">
                      {analytics.top_performer?.marks || 0} marks
                    </div>
                  </div>
                </div>

                <div className="analytics-card highlight">
                  <div className="card-header ">
                    <BarChart3 size={24} />
                    <h3>Average Marks</h3>
                  </div>
                  <div className="card-content">
                    <div className="big-number">
                      {analytics.average_marks?.toFixed(1) || 0}
                    </div>
                    <div className="subtitle">out of 100</div>
                  </div>
                </div>

                <div className="analytics-card highlight">
                  <div className="card-header">
                    <TrendingUp size={24} />
                    <h3>Highest Score</h3>
                  </div>
                  <div className="card-content">
                    <div className="big-number">
                      {analytics.highest_marks || 0}
                    </div>
                    <div className="subtitle">maximum marks</div>
                  </div>
                </div>

                <div className="analytics-card highlight">
                  <div className="card-header">
                    <Users size={24} />
                    <h3>Below Average</h3>
                  </div>
                  <div className="card-content">
                    <div className="big-number">
                      {analytics.below_average_count || 0}
                    </div>
                    <div className="subtitle">students need help</div>
                  </div>
                </div>

                <div className="analytics-card highlight">
                  <div className="card-header">
                    <BookOpen size={24} />
                    <h3>Score Range</h3>
                  </div>
                  <div className="card-content">
                    <div className="big-number">
                      {analytics.lowest_marks || 0} -{" "}
                      {analytics.highest_marks || 0}
                    </div>
                    <div className="subtitle">min - max scores</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <BarChart3 size={48} />
                <p>No data available for analytics. Add some students first!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
