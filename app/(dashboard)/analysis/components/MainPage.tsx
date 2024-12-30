import { AnalysisOperation, Element as AnalysisElement } from "@/api_lib/Analysis";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { FaFileCirclePlus } from "react-icons/fa6";
import { IoIosArrowUp } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
const { highlight } = require('sql-highlight')
import styles from "../Markdown.module.scss";
import AnsiToHtml from 'ansi-to-html';
import remarkGfm from "remark-gfm";
import LoadingUI from "@/components/loading";
import RenderCase from "@/components/rendercase";

export default function ChatMain({ messages, setMessages }) {
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatRef = useRef(null);
    const analysisOperation = new AnalysisOperation();
    const ansiToHtml = new AnsiToHtml();

    const simulateBotReply = (fullReply: React.ReactNode) => {

        const nodes = React.Children.toArray(fullReply);
        let currentIndex = 0;

        const showNextMessage = () => {
            if (currentIndex < nodes.length) {
                const partialContent = nodes.slice(0, currentIndex + 1);

                setMessages((prev: any) => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.type === "bot" && lastMessage.isPartial) {
                        return [
                            ...prev.slice(0, -1),
                            { type: "bot", content: partialContent, isPartial: true },
                        ];
                    }
                    return [
                        ...prev,
                        { type: "bot", content: partialContent, isPartial: true },
                    ];
                });

                currentIndex++;
                setTimeout(showNextMessage, 50);
            } else {
                setMessages((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    return [
                        ...prev.slice(0, -1),
                        { type: "bot", content: lastMessage.content, isPartial: false },
                    ];
                });
                setIsTyping(false);
            }
        };

        showNextMessage();
    };

    const GetMessage = async (prompt: string): Promise<AnalysisElement[]> => {
        const token = localStorage?.getItem("accessToken");
        const result = await analysisOperation.getReport({
            token: token,
            prompt: prompt,
        });
        return result.data;
    };

    const convertToTable = (data) => {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                return 'No data available.';
            }

            const headers = Object.keys(data[0]);

            let markdown = `| ${headers.join(' | ')} |\n`;
            markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;

            data.forEach(row => {
                markdown += `| ${headers.map(header => row[header]).join(' | ')} |\n`;
            });

            return markdown;
        } catch (error) {
            return 'Invalid JSON string.';
        }
    }

    function toggleAccordion(index) {
        const content = document.getElementById(`content-${index}`);
        const icon = document.getElementById(`icon-${index}`);

        const minusSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
            <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
          </svg>
        `;

        const plusSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
          </svg>
        `;

        if (content.style.maxHeight && content.style.maxHeight !== '0px') {
            content.style.maxHeight = '0';
            icon.innerHTML = plusSVG;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.innerHTML = minusSVG;
        }
    }

    const sendMessage = async () => {
        if (isTyping) return;
        if (!input.trim()) return;

        const userMessage = { type: "user", content: <p>{input}</p> };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);
        const response = await GetMessage(input);
        simulateBotReply(response?.map((item) => {
            const randomNum = Math.floor(Math.random() * 1000);

            if (item.type == "text") {
                let data = String(item.content);
                return (
                    <div className="rounded-lg bg-darkContainer p-4 shadow text-gray-200">
                        <header>
                            <ReactMarkdown
                                children={data}
                                remarkPlugins={[remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                            />
                        </header>
                    </div>
                );
            } else if (item.type == "graphResult") {
                const base64String = `data:image/png;base64,${item.content}`;
                return (
                    <div className="rounded-lg bg-darkContainer p-4 shadow">
                        <section className="my-4 flex justify-center">
                            <img
                                src={base64String}
                                alt="Graph Result"
                                className="w-full max-w-3xl mx-auto rounded-md shadow-lg"
                            />
                        </section>
                    </div>
                );
            } else if (item.type == "queryResult") {
                const highlighted = highlight(item.query);
                const htmlString = ansiToHtml.toHtml(highlighted);
                const table = convertToTable(item.content);

                return (
                    <div className="rounded-lg bg-darkContainer p-4 shadow text-gray-200" key={randomNum}>
                        <header>
                            <h3 className="font-bold mb-4">QUERY:</h3>
                            <div
                                className="sql-highlight text-gray-300 bg-darkContainerPrimary p-4 rounded-t-md font-mono text-sm overflow-auto"
                                dangerouslySetInnerHTML={{ __html: htmlString }}
                            ></div>
                        </header>
                        <section>
                            <button
                                onClick={() => toggleAccordion(randomNum)}
                                className="w-full flex justify-between items-center py-3 text-gray-200 bg-darkContainerPrimary rounded-b-md mt-2 px-4"
                            >
                                <h3 className="font-bold">QUERY RESULT:</h3>
                                <span
                                    id={`icon-${randomNum}`}
                                    className="text-gray-400 transition-transform duration-300"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </span>
                            </button>
                            <div
                                id={`content-${randomNum}`}
                                className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out mt-4"
                            >
                                <header className="p-4 flex justify-center">
                                    <ReactMarkdown
                                        className={styles.markdown}
                                        children={table}
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                    />
                                </header>
                            </div>
                        </section>
                    </div>
                );
            }
        }));
    };

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            {/* Khung chat */}
            <div
                ref={chatRef}
                className="h-[calc(100dvh-200px)] overflow-y-scroll mb-[100px] no-scrollbar"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex mb-4 ${message.type === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`p-3 rounded-lg ${message.type === "user"
                                ? "bg-blue-500 text-white max-w-[300px]"
                                : "bg-lightPrimary dark:bg-darkContainerPrimary text-white max-w-[calc(90%)] flex flex-col gap-3"
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                <RenderCase renderIf={isTyping}>
                    <div
                        className={`flex mb-4 justify-start`}
                    >
                        <div
                            className={`p-3 rounded-lg bg-lightPrimary dark:bg-darkContainerPrimary text-white max-w-[calc(90%)]`}
                        >
                            <LoadingUI />
                        </div>
                    </div>
                </RenderCase>
            </div>

            <div className="flex absolute bottom-0 w-full -ml-2 bg-white dark:bg-[#242526] px-2 py-2">
                <div className="flex p-2 w-full relative h-[90px] bg-lightPrimary dark:bg-[#2F2F2F] rounded-xl">
                    <input
                        name="prompt"
                        id="default-search"
                        type="text"
                        className="w-full h-fit px-2 py-2 bg-lightPrimary dark:bg-[#2F2F2F] rounded-md focus:outline-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Nhập tin nhắn..."
                    />
                    <button
                        onClick={sendMessage}
                        className="h-8 w-8 bottom-1 bg-white absolute right-1 rounded-full flex justify-center place-items-center"
                    >
                        <IoIosArrowUp className="text-[#2F2F2F] w-5 h-5" />
                    </button>
                    <FaFileCirclePlus className="absolute left-3 bottom-3 text-gray-400 dark:text-white" />
                </div>
            </div>
        </div>
    );
}