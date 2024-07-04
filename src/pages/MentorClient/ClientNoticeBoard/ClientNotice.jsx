import React, { useEffect, useState } from 'react';
import ClientSidebar from '../ClientSidebar/ClientSidebar.jsx';
import ClientNavbar from '../ClientNavbar/ClientNavbar.jsx';
import Urlprotected from '../../../components/Urlprotected.jsx';


function NoticeBoard() {
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
        <Urlprotected path="Client">
        <div className='flex gap-[30px] bg-gray-100'>
            <div className="max-sm:hidden  ">

                <ClientSidebar liname={"Notice Board"} />
            </div>
            <div className='notice_board_body_main mr-[12px] h-[100vh] overflow-y-hidden' >

                <ClientNavbar Board Navtext={"Notice Board"} />

                <div className='notice_board_main_container w-full '>
                    <div className='overflow-x-auto md:h-[75vh]'>

                        {articles && articles.map((article) => (
                            <div key={article._id} className={`${article.classes}`}>
                                <div className='flex gap-4 mt-[20px] p-[10px] rounded-[8px] relative' style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}>

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
