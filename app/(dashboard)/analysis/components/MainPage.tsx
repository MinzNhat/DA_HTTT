"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoShareOutline } from "react-icons/io5";
import { IoIosAdd, IoIosBrowsers } from "react-icons/io";
import RenderCase from "@/components/rendercase";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import Widget from "@/components/widget";
import {
    FaMoneyBillWave,
    FaCoins,
    FaChartLine,
    FaAngleLeft,
    FaAngleRight,
} from "react-icons/fa";
import { AnalysisOperation, Element } from "@/api_lib/Analysis";

import { useIntl } from "react-intl";
import LoadingUI from "@/components/loading";

import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
const { highlight } = require('sql-highlight')
import AnsiToHtml from 'ansi-to-html';
import remarkGfm from "remark-gfm";
import styles from "../Markdown.module.scss";


const AnalysisMain = () => {
    // Set up
    const ansiToHtml = new AnsiToHtml();
    const analysisOperation = new AnalysisOperation();
    const [prompt, setPrompt] = useState<string | null>(null)
    const [report, setReport] = useState<Element[]>([]);
    const [display, setDisplay] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Disable forms
    useEffect(() => { }, [loading]);

    // Handle submit button onClick
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setPrompt(e.target.prompt.value);

        // Do the magic
        const token = localStorage?.getItem("accessToken");
        const result = await analysisOperation.getReport({
            token: token,
            prompt: e.target.prompt.value,
        });
        if (!result.error) {
            setReport(result.data);
            setDisplay(true);
        }

        setLoading(false);
    };

    // Refresh form
    const handleRefresh = () => {
        setReport([]);
        setDisplay(false);
    }

    // Query result Acordion
    function toggleAccordion(index) {
        const content = document.getElementById(`content-${index}`);
        const icon = document.getElementById(`icon-${index}`);

        // SVG for Minus icon
        const minusSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
            <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
          </svg>
        `;

        // SVG for Plus icon
        const plusSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
          </svg>
        `;

        // Toggle the content's max-height for smooth opening and closing
        if (content.style.maxHeight && content.style.maxHeight !== '0px') {
            content.style.maxHeight = '0';
            icon.innerHTML = plusSVG;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.innerHTML = minusSVG;
        }
    }

    // Convert to markdown table
    const convertToTable = (data) => {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                return 'No data available.';
            }

            // Extract headers from the first object keys
            const headers = Object.keys(data[0]);

            // Create the Markdown table header
            let markdown = `| ${headers.join(' | ')} |\n`;
            markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;

            // Add the data rows
            data.forEach(row => {
                markdown += `| ${headers.map(header => row[header]).join(' | ')} |\n`;
            });

            return markdown;
        } catch (error) {
            return 'Invalid JSON string.';
        }

    }

    return (
        <div className="bg-lightPrimary dark:!bg-[#3a3b3c]/20 p-4 h-full">
            {display ? (
                <div className="border border-gray-200 h-full ml-32 mr-32 rounded-lg overflow-hidden flex flex-col">
                    <div className="mb-0 border-b border-slate-200 pt-3 pb-2 px-1 text-center">
                        <span className="text-2xl font-bold text-navy-700 dark:text-white">Report: "{prompt}"</span>
                    </div>


                    <div className="overflow-y-auto flex-grow">
                        {report?.map((item) => {
                            if (item.type == "text") {
                                let data = String(item.content);
                                data = data.replaceAll("\n", "&nbsp; \n")
                                // Add some format here 
                                return (<div className="dark:bg-[#242526] rounded-lg shadow ml-8 mr-8 mx-auto my-5">
                                    <header className="p-4 text-lg">
                                        <ReactMarkdown children={data}
                                            remarkPlugins={[remarkBreaks]}
                                            rehypePlugins={[rehypeRaw]}
                                        />
                                    </header>
                                </div>)
                            }
                            else if (item.type == "graphResult") {
                                const base64String = `data:image/png;base64,${item.content}`;
                                return (<div className="dark:bg-[#242526] rounded-lg shadow ml-8 mr-8 mx-auto my-5 p-5">
                                    <section>
                                        <img src={base64String} className="w-full max-w-3xl mx-auto" />
                                    </section>
                                </div>)
                            }
                            else if (item.type == "queryResult") {
                                // Handle the query
                                const highlighted = highlight(item.query)
                                const htmlString = ansiToHtml.toHtml(highlighted);
                                // Handle the table
                                const table = convertToTable(item.content);
                                return (<div className="dark:bg-[#242526] rounded-lg shadow ml-8 mr-8 mx-auto my-5">
                                    <header className="p-4">
                                        <h3 className="text-lg font-bold">QUERY:</h3>
                                        <div
                                            className="sql-highlight text-xl font-bold text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: htmlString }}
                                        ></div>
                                    </header>
                                    <section>
                                        <div className="border-t border-slate-200">
                                            <button onClick={() => toggleAccordion(1)} className="w-full flex justify-between items-center py-5 text-slate-800 p-4">
                                                <h3 className="text-lg font-bold">QUERY RESULT</h3>
                                                <span id="icon-1" className="text-slate-800 transition-transform duration-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <div id="content-1" className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                                                <header className="p-4 text-lg">
                                                    <ReactMarkdown
                                                        className={styles.markdown}
                                                        children={table}
                                                        remarkPlugins={[remarkGfm]}
                                                        rehypePlugins={[rehypeRaw]}
                                                    />
                                                </header>
                                            </div>
                                        </div>
                                    </section>
                                </div>)
                            }
                            else if (item.type == "elapsedTime")
                                return (<div className="dark:bg-[#242526] rounded-lg shadow ml-8 mr-8 mx-auto my-5">
                                    <header className="p-4">
                                        <h3 className="text-medium font-bold">{item.content}</h3>
                                    </header>
                                </div>)
                        }
                        )}
                        <div className="flex h-16 items-center">
                            <button onClick={() => handleRefresh()} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mx-auto w-1/6 mb-8">
                                Create new report
                            </button>
                        </div>
                    </div>
                </div>


            ) : (
                <div className="h-96 flex items-center justify-center">
                    <form onSubmit={(e) => handleSubmit(e)} className="w-3/6 mx-auto">
                        <h1 className="text-center mb-4 text-1xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                            {loading ? (<li className="flex items-center justify-center">
                                <div role="status">
                                    <svg aria-hidden="true" className="w-8 h-8 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                Handling your request...
                            </li>
                            ) : ("Hello, how can I help you?")}
                        </h1>
                        <label
                            htmlFor="default-search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                        >
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                name="prompt"
                                id="default-search"
                                className="block w-full p-4 ps-10 text-xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter your prompt"
                                required
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="h-11 text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                disabled={loading}
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AnalysisMain;
