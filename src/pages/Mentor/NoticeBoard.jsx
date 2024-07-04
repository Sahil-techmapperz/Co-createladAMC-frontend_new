import React, { useEffect, useState } from 'react';
import "./../../CSS/NoticeBoard.css";
import '../../components/Sidebar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Navbar from '../../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import Urlprotected from '../../components/Urlprotected.jsx';


function NoticeBoard() {
    const [modalOpen, setModalOpen] = useState(false);
    const [articles, setArticles] = useState([]);
    const [articleform, setArticleform] = useState({
        bannerimage: null, // Or undefined
        title: '',
        description: '',
    });

    const token = JSON.parse(localStorage.getItem("token")) || "";
    let BaseUrl = process.env.REACT_APP_Base_Url;






    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await getArticles();
            setArticles(response);
        } catch (error) {
            console.error('Error fetching articles:', error);
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
            return articles
        } catch (error) {
            console.error('Error retrieving articles:', error);
            return []; // Return an empty list if there's an error
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "bannerimage" && files.length > 0) {
            // If banner image, set it directly to the form object
            setArticleform({ ...articleform, [name]: files[0] });
        } else {
            // Otherwise, handle text inputs normally
            setArticleform({ ...articleform, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await uploadArticle(articleform); // Add new article
            setModalOpen(false);
            fetchArticles(); // Refresh articles after adding a new one
        } catch (error) {
            console.error('Error uploading article:', error);
        }
    };

    const uploadArticle = async (article, bannerFile) => {
        try {
            // Create a FormData object to handle both the banner file and article details
            const formData = new FormData();
            formData.append("bannerImage", articleform.bannerimage);
            formData.append("title", article.title);
            formData.append("description", article.description);

            const response = await fetch(`${BaseUrl}/api/article/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`, // Only authorization is needed in the headers
                },
                body: formData, // Attach the formData object as the body
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


    const convertDateToReadableFormat = (isoDateString) => {
        const dateObj = new Date(isoDateString);

        // Day of the week names
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[dateObj.getDay()];

        // Month names
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[dateObj.getMonth()]; // Get the month name

        const dayOfMonth = dateObj.getDate(); // Day of the month
        const year = dateObj.getFullYear(); // Year

        // Assemble the final string
        return `${dayName}, ${monthName} ${dayOfMonth} ${year}`;
    };



    return (
        <Urlprotected path="Mentor">
            <div className='flex gap-[30px] bg-gray-100'>
                <div className="max-sm:hidden  ">
                    <Sidebar liname={"Notice Board"} />
                </div>
                <div className='notice_board_body_main mr-[12px] h-[100vh] overflow-y-hidden' >

                    <Navbar Board Navtext={"Notice Board"} />
                    {/* <div className='m-[20px] text-[18px] font-[600]'>
                    <Link to={"/"}>Dashboard</Link> &gt; Notice Board
                </div> */}
                    <div className=' mt-[5px] flex justify-between  items-center '>
                        <p className='text-lg font-bold'>All Notice</p>
                        {/* <button onClick={()=> setModalOpen(true)} className='w-[130px] h-[50px] text-white p-[5px] border rounded-lg bg-blue-500'>Add New Notice</button> */}
                    </div>


                    {modalOpen && (
                        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                            <div className='bg-white p-6 rounded-lg w-[400px]'>
                                <h2 className='text-xl font-bold mb-4'>Add New Notice</h2>
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
                                            value={articleform.title || ""} // Ensure default value to prevent uncontrolled state
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
                                        <button
                                            type='submit'
                                            className='bg-blue-500 w-fit text-white py-2 px-4 rounded-lg'
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type='button'
                                            className='bg-red-500 w-fit text-white py-2 px-4 rounded-lg'
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}



                    <div className='notice_board_main_container w-full'>
                        <div className='overflow-x-auto md:h-[75vh]'>

                            {articles && articles.map((article) => (
                                <div key={article._id} className={`${article.classes}`}>
                                    <div className='flex gap-4 p-[10px] rounded-[8px] relative' style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}>

                                        {/* Ensure imageSrc is correctly handled. If it's a path string, use it directly. If it's a variable representing an imported image, make sure it's imported at the top. */}
                                        <img src={article.bannerimage} alt={article.title} className='ml-[10px] w-[220px] max-sm:w-[100px] max-sm:h-[100px] max-sm:flex max-sm:justifi-center max-sm:items-center' />

                                        <div className='notice_board_header_part'>
                                            <div className=''>
                                                <h5 className='font-bold'>{article.title}</h5>
                                                <p className='notice_board_blog_cotesion text-gray-600 text-[14px] mt-[25px] p-0'>{article.description}</p>
                                                <p className='noticeBoardName text-[14px]'>{article.author}</p>
                                                {/* Ensure the icon prop is correctly used. If `article.icon` is a variable, it should reference an imported icon object. */}
                                                {/* <FontAwesomeIcon icon={article.icon} /> */}
                                            </div>

                                            <div>
                                                <p className='absolute bottom-2 right-3 font-bold'>{convertDateToReadableFormat(article.date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </Urlprotected>
    )
}

export default NoticeBoard
