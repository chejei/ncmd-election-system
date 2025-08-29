import React, { useEffect, useState } from 'react';
import TableDrag from '../../components/TableDrag';
import axios from "../../api/axios";
import Swal from 'sweetalert2';

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch positions (no pagination)
  const fetchPositions = (search = '') => {
    setPositions([]);
    axios
      .get(`/positions?search=${search}`)
      .then((response) => {
        setPositions(response.data); // expect full array instead of paginated
      })
      .catch((error) => console.error('Error fetching positions:', error));
  };

  useEffect(() => {
    fetchPositions(searchTerm);
  }, [searchTerm]);

  // Handle drag end
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(positions);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Update state
    setPositions(reordered);

    // Update priorities in DB
    try {
      await axios.post("/positions/reorder", {
        positions: reordered.map((pos, index) => ({
          id: pos.id,
          priority: index + 1,
        })),
      });
    } catch (error) {
      console.error("Error updating priorities:", error);
      Swal.fire("Error!", "Failed to update priority.", "error");
    }
  };

  // Delete one position
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/positions/${id}`);
          fetchPositions(searchTerm);

          Swal.fire({
            title: "Deleted!",
            text: "Position has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  // Select toggle
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Bulk delete
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      Swal.fire("No Selection", "Please select at least one position.", "info");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${selectedIds.length} position(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(selectedIds.map((id) => axios.delete(`/positions/${id}`)));
          fetchPositions(searchTerm);
          setSelectedIds([]);

          Swal.fire({
            title: "Deleted!",
            text: "Selected positions have been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  // Table headers for Positions
  const tableHeaders = {
    title: 'Title',
    max_winners: 'Max Winners',
    action: "Action"
  };

  const actions = {
    view: false,
    edit: true,
    delete: true
  };

  return (
    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
      <div className="bg-white relative overflow-x-auto">
        <TableDrag 
          name="position"
          items={positions}
          header={tableHeaders}
          tableName="Position"
          onSearchChange={setSearchTerm}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onDeleteSelected={handleDeleteSelected}
          link='/admin/candidate/position'
          onDragEnd={handleDragEnd}
          actions={actions}
        />
      </div>
    </div>
  );
}
