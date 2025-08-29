import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import axios from "../../api/axios";
import Swal from 'sweetalert2';

export default function Candidate() {
   const [candidates, setCandidates] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedIds, setSelectedIds] = useState([]);

   const fetchCandidates = (page = 1, search = '') => {
      setCandidates([]);
      axios.get(`/candidates?page=${page}&search=${search}`)
            .then(response => {
            setCandidates(response.data.data);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.last_page);
            })
            .catch(error => console.error('Error fetching candidates:', error));
   };

   useEffect(() => {
      fetchCandidates(currentPage, searchTerm);
   }, [currentPage, searchTerm]); 

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
            await axios.delete(`/candidates/${id}`);
            // setCandidates(candidates.filter((c) => c.id !== id));
            fetchCandidates(1, searchTerm);
            setCurrentPage(1);
            
            Swal.fire({
               title: "Deleted!",
               text: "Candidate has been deleted.",
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

   const toggleSelect = (id) => {
      setSelectedIds(prev =>
         prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
   };

   const handleDeleteSelected = () => {
      if (selectedIds.length === 0) {
         Swal.fire("No Selection", "Please select at least one candidate.", "info");
         return;
      }

      Swal.fire({
         title: "Are you sure?",
         text: `Delete ${selectedIds.length} candidate(s)?`,
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#d33",
         cancelButtonColor: "#3085d6",
         confirmButtonText: "Yes, delete them!"
      }).then(async (result) => {
         if (result.isConfirmed) {
            try {
            await Promise.all(selectedIds.map(id => axios.delete(`/candidates/${id}`)));
            fetchCandidates(1, searchTerm);
            setCurrentPage(1);
            setSelectedIds([]);

            Swal.fire({
               title: "Deleted!",
               text: "Selected candidates have been deleted.",
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

   const actions = {
      view: true,
      edit: true,
      delete: true
   };
   const tableHeaders = {"full_name":'Name', "church_name":'Church', "position_title":'Position', "photo":"Photo", "action":'Action' }
   return (
    <>
       <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
         <div className="bg-white relative overflow-x-auto">
            <Table 
               name="candidate"
               items={candidates} 
               header={tableHeaders} 
               tableName="Candidate" 
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={setCurrentPage}
               onSearchChange={setSearchTerm} 
               onDelete={handleDelete} 
               selectedIds={selectedIds}
               onToggleSelect={toggleSelect}
               onDeleteSelected={handleDeleteSelected}   
               link='/admin/candidate'
               actions={actions}
            />
         </div>

       </div>
    </>
  );
}
