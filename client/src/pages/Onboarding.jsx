import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { AppContent } from "@/context/AppContext";

const Onboarding = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, userData, setUserData } =
    useContext(AppContent);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialogs, setOpenDialogs] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/user/all-users`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setData(res.data.users);
      } catch (error) {
        console.log("error occur while getting users", error);
        toast.error("Error occurred while getting users");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Filter data based on search term (username)
  const filteredData = data.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  //  delete user
  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Delete confirmation handler
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);

      // Always call delete API
      await axios.delete(`${backendUrl}/api/user/delete-user/${userToDelete}`);
      toast.success("User deleted successfully");

      // If deleted user is the current logged-in user
      if (userData && userData.id === userToDelete) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
        return; 
      }

      // If it's some other user, just update local state
      setData((prev) => prev.filter((user) => user._id !== userToDelete));
    } catch (error) {
      toast.error("Error occurred while deleting the user");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Initialize edit data when opening dialog
  const handleEditClick = (user) => {
    setEditData((prev) => ({
      ...prev,
      [user._id]: {
        userName: user.userName,
        email: user.email,
      },
    }));
  };

  // Handle input changes
  const handleInputChange = (userId, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  // Handle form submission update user
  const handleSubmit = async (userId, e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await axios.put(`${backendUrl}/api/user/update-user/${userId}`, {
        userName: editData[userId]?.userName,
      });

      toast.success("User updated successfully");

      // Close the dialog
      setOpenDialogs((prev) => ({
        ...prev,
        [userId]: false,
      }));

      setData((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, userName: editData[userId]?.userName }
            : user
        )
      );
    } catch (error) {
      toast.error("Error occurred while updating the user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpen = (userId, isOpen) => {
    setOpenDialogs((prev) => ({
      ...prev,
      [userId]: isOpen,
    }));
  };

  // Reset to first page when search term or rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-2/3 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Manage All Users
        </h2>

        {/* Search bar */}
        <div className="mb-6 flex justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by username..."
              className="w-full p-2 pl-10 rounded-md bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* show rows per page */}
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-400">Rows per page:</span>
            <select
              className="bg-slate-800 border border-slate-700 rounded-md p-1 text-white text-sm"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-[oklch(0.78_0.11_274.49)] p-4 text-white">
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <ClipLoader color="#36d7b7" size={24} />
                  </TableCell>
                </TableRow>
              ) : currentRows.length > 0 ? (
                currentRows.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Dialog
                        open={!!openDialogs[row._id]}
                        onOpenChange={(isOpen) =>
                          handleDialogOpen(row._id, isOpen)
                        }
                      >
                        <DialogTrigger asChild>
                          <button
                            className="cursor-pointer"
                            onClick={() => handleEditClick(row)}
                          >
                            <Edit />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-blue-200 to-purple-400 text-slate-900">
                          <form onSubmit={(e) => handleSubmit(row._id, e)}>
                            <DialogHeader>
                              <DialogTitle className="text-2xl">
                                Edit profile
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 mt-4">
                              <div className="grid gap-3">
                                <Label htmlFor={`userName-${row._id}`}>
                                  Username
                                </Label>
                                <Input
                                  id={`userName-${row._id}`}
                                  name="userName"
                                  value={
                                    editData[row._id]?.userName || row.userName
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      row._id,
                                      "userName",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor={`email-${row._id}`}>
                                  Email
                                </Label>
                                <Input
                                  id={`email-${row._id}`}
                                  name="email"
                                  value={editData[row._id]?.email || row.email}
                                  disabled
                                />
                              </div>
                            </div>
                            <DialogFooter className="mt-2">
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  type="button"
                                  className="cursor-pointer"
                                >
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer"
                              >
                                {isSubmitting ? "Saving..." : "Save changes"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <button
                        onClick={() => handleDeleteClick(row._id)}
                        className="text-red-400 cursor-pointer"
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    {searchTerm
                      ? "No matching users found"
                      : "No users available"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-end items-center mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === 1
                    ? "bg-slate-800 text-gray-500 cursor-not-allowed"
                    : "bg-slate-700 text-white hover:bg-slate-600"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-slate-800 text-gray-500 cursor-not-allowed"
                    : "bg-slate-700 text-white hover:bg-slate-600"
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen} // Simplified this line
      >
        <AlertDialogContent className="bg-gradient-to-br from-blue-200 to-purple-400 text-slate-900 border-0 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-800">
              This will permanently delete the user account. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border border-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 text-white cursor-pointer"
              disabled={loading}
            >
              {loading ? <ClipLoader size={18} color="#fff" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Onboarding;
