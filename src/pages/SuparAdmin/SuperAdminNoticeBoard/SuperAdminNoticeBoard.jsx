import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from '../../../components/Mobile/MobileNav';
import SuperAdminSide from '../SuperAdminSide/SuperAdminSide';
import SuperAdminNavbar from '../SuperAdminNav/SuperAdminNav';
import Urlprotected from '../../../components/Urlprotected';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

function SuperAdminNoticeBoard() {
    const [modalOpen, setModalOpen] = useState(false);
    const [articles, setArticles] = useState([]);
    const [articleform, setArticleform] = useState({
        bannerimage: null,
        title: '',
        description: '',
    });
    const [editingArticle, setEditingArticle] = useState(null);

    const token = JSON.parse(localStorage.getItem("token")) || "";
    let BaseUrl = process.env.REACT_APP_Base_Url;

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await getArticles();
            setArticles(response);
            toast.success('Articles fetched successfully!');
        } catch (error) {
            console.error('Error fetching articles:', error);
            toast.error('Error fetching articles');
        }
    };

    const getArticles = async () => {
        try {
            const response = await fetch(`${BaseUrl}/api/article/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const articles = await response.json();
            return articles;
        } catch (error) {
            console.error('Error retrieving articles:', error);
            return [];
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "bannerimage" && files.length > 0) {
            setArticleform({ ...articleform, [name]: files[0] });
        } else {
            setArticleform({ ...articleform, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingArticle) {
                await updateArticle(editingArticle._id, articleform);
                toast.success('Article updated successfully!');
            } else {
                await uploadArticle(articleform);
                toast.success('Article created successfully!');
            }
            setModalOpen(false);
            fetchArticles();
        } catch (error) {
            console.error('Error uploading article:', error);
            toast.error('Error uploading article');
        }
    };

    const uploadArticle = async (article) => {
        try {
            const formData = new FormData();
            formData.append("bannerImage", articleform.bannerimage);
            formData.append("title", article.title);
            formData.append("description", article.description);

            const response = await fetch(`${BaseUrl}/api/article/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const res = await response.json();
            console.log(res);
        } catch (error) {
            console.error('Error uploading article:', error);
            throw error;
        }
    };

    const updateArticle = async (id, article) => {
        try {
            const formData = new FormData();
            formData.append("bannerImage", articleform.bannerimage);
            formData.append("title", article.title);
            formData.append("description", article.description);

            const response = await fetch(`${BaseUrl}/api/article/edit/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const res = await response.json();
            console.log(res);
        } catch (error) {
            console.error('Error updating article:', error);
            throw error;
        }
    };

    const deleteArticle = async (id) => {
        try {
            const response = await fetch(`${BaseUrl}/api/article/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const res = await response.json();
            console.log(res);
            fetchArticles();
            toast.success('Article deleted successfully!');
        } catch (error) {
            console.error('Error deleting article:', error);
            toast.error('Error deleting article');
            throw error;
        }
    };

    const openEditModal = (article) => {
        setEditingArticle(article);
        setArticleform({
            bannerimage: null,
            title: article.title,
            description: article.description,
        });
        setModalOpen(true);
    };

    const convertDateToReadableFormat = (isoDateString) => {
        const dateObj = new Date(isoDateString);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[dateObj.getDay()];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[dateObj.getMonth()];
        const dayOfMonth = dateObj.getDate();
        const year = dateObj.getFullYear();
        return `${dayName}, ${monthName} ${dayOfMonth} ${year}`;
    };

    return (
        <Urlprotected path="Admin">
            <div className='flex gap-[30px] bg-gray-100'>
                <div className="max-sm:hidden">
                    <SuperAdminSide liname={"Notice Board"} />
                </div>
                <div className='notice_board_body_main mr-[12px] h-[100vh] overflow-y-hidden'>
                    <div className="sm:hidden ml-[10px]"><MobileNav /></div>
                    <SuperAdminNavbar Board Navtext={"Notice Board"} />
                    <div className='m-[20px] text-[18px] font-[600]'>
                        <Link to={"/"}>Dashboard</Link> &gt; Notice Board
                    </div>
                    <div className='mt-[5px] flex justify-between items-center'>
                        <p className='text-lg font-bold'>All Notice</p>
                        <button onClick={() => { setModalOpen(true); setEditingArticle(null); }} className='w-[130px] h-[50px] text-white p-[5px] border rounded-lg bg-blue-500'>Add New Notice</button>
                    </div>

                    {modalOpen && (
                        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                            <div className='bg-white p-6 rounded-lg w-[400px]'>
                                <h2 className='text-xl font-bold mb-4'>{editingArticle ? 'Edit Notice' : 'Add New Notice'}</h2>
                                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                    <label>
                                        Banner Image:
                                        <input
                                            type='file'
                                            name='bannerimage'
                                            onChange={handleChange}
                                            className='form-input w-full p-2 border border-gray-300 rounded-lg'
                                        />
                                    </label>

                                    <label>
                                        Title:
                                        <input
                                            type='text'
                                            name='title'
                                            value={articleform.title || ""}
                                            onChange={handleChange}
                                            className='form-input w-full p-2 border border-gray-300 rounded-lg'
                                        />
                                    </label>

                                    <label>
                                        Description:
                                        <textarea
                                            name='description'
                                            value={articleform.description || ""}
                                            onChange={handleChange}
                                            className='form-textarea w-full p-2 border border-gray-300 rounded-lg'
                                        />
                                    </label>

                                    <div className='flex gap-2'>
                                        <button type='submit' className='bg-blue-500 w-fit text-white py-2 px-4 rounded-lg '>
                                            {editingArticle ? 'Update' : 'Submit'}
                                        </button>
                                        <button type='button' className='bg-red-500 w-fit text-white py-2 px-4 rounded-lg' onClick={() => setModalOpen(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className='notice_board_main_container w-full relative mt-2'>
                        <div className='overflow-x-auto md:h-[75vh]'>
                            {articles && articles.map((article) => (
                                <div key={article._id} className={`${article.classes}`}>
                                    <div className='flex gap-4 mb-[20px] p-[10px] rounded-[8px] relative' style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}>
                                        <img src={article.bannerimage} alt={article.title} className='ml-[10px] w-[220px] max-sm:w-[100px] max-sm:h-[100px] max-sm:flex max-sm:justify-center max-sm:items-center rounded' />
                                        <div className='notice_board_header_part'>
                                            <div className=''>
                                                <h5 className='font-bold'>{article.title}</h5>
                                                <p className='notice_board_blog_cotesion text-gray-600 text-[14px] mt-[25px] p-0'>{article.description}</p>
                                                <p className='noticeBoardName text-[14px]'>{article.author}</p>
                                            </div>
                                            <div className='absolute top-2 right-[50px] flex gap-2'>
                                                <button onClick={() => openEditModal(article)} className='text-blue-500 w-fit'>
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteArticle(article._id)} className='text-red-500 w-fit'>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <p className='absolute bottom-2 right-3 font-bold'>{convertDateToReadableFormat(article.date)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </Urlprotected>
    );
}

export default SuperAdminNoticeBoard;
