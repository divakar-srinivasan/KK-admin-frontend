import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const useTypingEffect = (text, typingSpeed = 100, erasingSpeed = 50, delay = 1000) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer;

    if (isTyping) {
      if (index < text.length) {
        timer = setTimeout(() => {
          setDisplayText(text.substring(0, index + 1));
          setIndex(index + 1);
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsTyping(false);
        }, delay);
      }
    } else {
      if (index > 0) {
        timer = setTimeout(() => {
          setDisplayText(text.substring(0, index - 1));
          setIndex(index - 1);
        }, erasingSpeed);
      } else {
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timer);
  }, [index, isTyping, text, typingSpeed, erasingSpeed, delay]);

  return displayText;
};

const ProjectDisplay = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedProjectType, setEditedProjectType] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);

  const loadingText = useTypingEffect("Loading project details...", 100, 50, 1000);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/get");
        const projectDataWithImages = response.data.map((project) => {
          const base64Image = btoa(
            new Uint8Array(project.image.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          return { ...project, base64Image };
        });
        setProjects(projectDataWithImages);
      } catch (error) {
        setError("Error fetching the project details");
        console.error(error);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = (projectId) => {
    setProjectIdToDelete(projectId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete/${projectIdToDelete}`);
      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectIdToDelete));
      setShowConfirmModal(false);
      setProjectIdToDelete(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete the project.");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setEditedDescription(project.description);
    setEditedProjectType(project.projectType);
  };

  const handleUpdate = async () => {
    if (!editingProject) return;

    const formData = new FormData();
    formData.append("description", editedDescription);
    formData.append("projectType", editedProjectType);
    if (editedImage) {
      formData.append("image", editedImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/update/${editingProject._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj._id === editingProject._id
            ? {
                ...response.data.project,
                base64Image: editedImage
                  ? URL.createObjectURL(editedImage)
                  : proj.base64Image,
              }
            : proj
        )
      );

      setEditingProject(null);
      setEditedImage(null);
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Failed to update the project.");
    }
  };

  return (
    <div className="flex flex-col py-20">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
        }}
      >
        {projects.length > 0 ? (
          projects.map((projectData, index) => (
            <motion.div
              key={projectData._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-2xl hover:scale-[1.03] w-full max-w-[350px] mx-auto"
              initial={{ opacity: 0, y: "100vh" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="h-44 sm:h-52 overflow-hidden"
                whileHover={{ scale: 1.1, transition: { duration: 0.4 } }}
              >
                <img
                  src={`data:image/jpeg;base64,${projectData.base64Image}`}
                  alt={projectData.projectName}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="p-4 flex flex-col h-[140px]">
                <h3 className="text-lg font-bold text-gray-900 truncate">{projectData.projectName}</h3>
                <p className="text-gray-700 mt-2 text-sm overflow-hidden flex-1">
                  <strong>Description:</strong> {projectData.description}
                </p>
              </div>

              <div className="p-3 flex justify-center space-x-3">
                {/* Edit Button */}
                <motion.button
                  onClick={() => handleEdit(projectData)}
                  className="relative overflow-hidden bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md font-semibold 
                  hover:bg-blue-600 hover:shadow-lg transition-all duration-300 w-full sm:w-auto border-2 border-transparent hover:border-blue-600"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#3b82f6", 
                    transition: { duration: 0.4 },
                  }}
                >
                  <motion.span
                    className="absolute inset-0 bg-blue-300 opacity-0 rounded-full"
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  ></motion.span>
                  ✏️ Edit
                </motion.button>

                {/* Delete Button */}
                <motion.button
                  onClick={() => handleDelete(projectData._id)}
                  className="relative overflow-hidden bg-red-500 text-white px-6 py-2 rounded-lg shadow-md font-semibold 
                  hover:bg-red-600 hover:shadow-lg transition-all duration-300 w-full sm:w-auto border-2 border-transparent hover:border-red-600"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#ef4444", 
                    transition: { duration: 0.4 },
                  }}
                >
                  <motion.span
                    className="absolute inset-0 bg-red-300 opacity-0 rounded-full"
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  ></motion.span>
                  🗑️ Delete
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-red-600 text-center text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {loadingText}
          </motion.p>
        )}
      </motion.div>

      {/* Edit Modal */}
      {editingProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-[500px] p-8"
          >
            <button
              onClick={() => setEditingProject(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-2xl"
            >
              ×
            </button>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Project</h2>

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">Project Image</label>
              <input
                type="file"
                onChange={(e) => setEditedImage(e.target.files[0])}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Enter project description"
                rows="4"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Project Type</label>
              <select
                value={editedProjectType}
                onChange={(e) => setEditedProjectType(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a project type</option>
                <option value="Prestigious">Prestigious Project</option>
                <option value="Ongoing">Ongoing Project</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleUpdate}
                className="w-[48%] bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProject(null)}
                className="w-[48%] bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-[400px]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h2>
              <p className="text-center text-gray-600 mb-6">Are you sure you want to delete this project?</p>

              <div className="flex justify-between">
                <button
                  onClick={confirmDelete}
                  className="w-[48%] bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-[48%] bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDisplay;
