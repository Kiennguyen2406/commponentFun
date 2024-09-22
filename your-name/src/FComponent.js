//
// import {useState} from "react";
//
// export default function FComponent() {
//     //hook
//      let [list, setList] = useState([{ name: "Kien", phone: "123456789", email: "kien@example.com" },
//          { name: "Michael", phone: "987654321", email: "michael@example.com" }]); //
//     let [name, setName] = useState("");
//     let [phone, setPhone] = useState("");
//     let [email, setEmail] = useState("");
//     return(
//         <>
//             {list.map((item, index) => (
//             <tr key={index}>
//                 <td>{item.name}</td>
//                 <td>{item.phone}</td>
//                 <td>{item.email}</td>
//                 </tr>
//                 ))}
//             <h1>
//                 {name}
//             </h1>
//             <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
//
//             <button onClick={() => setList([...list,{name: name}])}>ADD</button>
//             </>
//
//     )
//  }

import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function FComponent() {
    const initialList = [
        {name: "Kien", phone: "123456789", email: "kien@example.com"},
        {name: "Michael", phone: "987654321", email: "michael@example.com"},
        // Add more contacts for testing
    ];

    const [list, setList] = useState(initialList);
    const [inpName, setInpName] = useState("");
    const [inpPhone, setInpPhone] = useState("");
    const [inpEmail, setInpEmail] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deletingIndex, setDeletingIndex] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const filteredList = list.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));

    const paginatedList = filteredList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleAddOrUpdate = () => {
        if (editingIndex === null) {
            setList([...list, {name: inpName, phone: inpPhone, email: inpEmail}]);
        } else {
            const updatedList = list.map((item, index) =>
                index === editingIndex
                    ? {name: inpName, phone: inpPhone, email: inpEmail}
                    : item
            );
            setList(updatedList);
        }
        setInpName("");
        setInpPhone("");
        setInpEmail("");
        setEditingIndex(null);
        setShowModal(false);
    };

    const handleEdit = (index) => {
        const itemToEdit = list[index];
        setInpName(itemToEdit.name);
        setInpPhone(itemToEdit.phone);
        setInpEmail(itemToEdit.email);
        setEditingIndex(index);
        setShowModal(true);
    };

    const handleDelete = (index) => {
        setDeletingIndex(index);
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        const newList = [...list];
        newList.splice(deletingIndex, 1);
        setList(newList);
        setShowConfirmModal(false);
        setDeletingIndex(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingIndex(null);
        setInpName("");
        setInpPhone("");
        setInpEmail("");
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setDeletingIndex(null);
    };

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center text-primary">Quản lý Liên hệ</h1>
            <button className="btn btn-primary mb-4" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus"></i> Thêm Liên hệ
            </button>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Tìm kiếm theo tên, sđt, email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="mb-4">
                {filteredList.length === 0 ? (
                    <p className="text-center text-muted">Chưa có liên hệ nào. Vui lòng thêm mới.</p>
                ) : (
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                        <tr>
                            <th>Tên</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedList.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.phone}</td>
                                <td>{item.email}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEdit(currentPage * itemsPerPage + index)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(currentPage * itemsPerPage + index)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
                    disabled={currentPage === 0}
                >
                    Trước
                </button>
                <span>{`Trang ${currentPage + 1} / ${totalPages}`}</span>
                <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages - 1))}
                    disabled={currentPage === totalPages - 1}
                >
                    Sau
                </button>
            </div>

            {/* Modal Thêm / Chỉnh sửa */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog"
                     style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingIndex === null ? "Thêm Liên hệ" : "Chỉnh sửa Liên hệ"}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Tên</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={inpName}
                                        onChange={(e) => setInpName(e.target.value)}
                                        placeholder="Nhập tên"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        value={inpPhone}
                                        onChange={(e) => setInpPhone(e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={inpEmail}
                                        onChange={(e) => setInpEmail(e.target.value)}
                                        placeholder="Nhập email"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Đóng</button>
                                <button className="btn btn-primary" onClick={handleAddOrUpdate}>
                                    {editingIndex === null ? "Thêm Liên hệ" : "Cập nhật Liên hệ"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}

            {/* Modal Xác nhận Xóa */}
            {showConfirmModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog"
                     style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa</h5>
                                <button type="button" className="btn-close" onClick={closeConfirmModal}
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa liên hệ này không?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeConfirmModal}>Hủy
                                </button>
                                <button className="btn btn-danger" onClick={confirmDelete}>Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showConfirmModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
}

