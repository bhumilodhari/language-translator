import React, { useEffect } from 'react'
import countries from '../data';
import "./Translate.css"
import { FaExchangeAlt } from "react-icons/fa"
import { FiCopy } from "react-icons/fi"

const Translate = () => {
    useEffect(() => {
        const fromText = document.querySelector(".form");
        const toText = document.querySelector(".to");
        const selectTag = document.querySelectorAll("select");
        const exchangeIcon = document.querySelector(".exchange");
        // const copyIcon = document.querySelector("li");
        const translateBtn = document.querySelector("button");

        selectTag.forEach((tag, id) => {
            for (let country_code in countries) {
                let selected =
                    id === 0
                        ? country_code.slice(0, 2) === navigator.language.slice(0, 2)
                            ? "selected"
                            : ""
                        : country_code === "hi-IN"
                            ? "selected"
                            : "";
                let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
                tag.insertAdjacentHTML("beforeend", option);

            }
        })

        translateBtn.addEventListener("click", () => {
            let text = fromText.value.trim();
            let translateFrom = selectTag[0].value;
            let translateTo = selectTag[1].value;
            console.log(text);
            console.log(translateFrom);
            console.log(translateTo);
            if (!text) return;
            toText.setAttribute("placeholder", "Translating....");

            let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

            fetch(apiURL)
                .then((res) => res.json())
                .then((data) => {
                    toText.value = data.responseData.translatedText
                });
        });

        exchangeIcon.addEventListener("click", () => {
            let tempText = fromText.value;
            let tempLang = selectTag[0].value;
            fromText.value = toText.value;
            toText.value = tempText;
            selectTag[0].value = selectTag[1].value;
            selectTag[1].value = tempLang;
        });

        fromText.addEventListener("keyup", () => {
            if (!fromText.value) {
                toText.value = '';
            }
        });

    }, []);

    return (
        <>
            <div className='container'>
                <div className='wrapper'>
                    <div className='text-container'>
                        <textarea
                            className='form'
                            spellCheck="false"
                            placeholder='Enter text'>
                        </textarea>
                        <textarea
                            className='to'
                            readOnly
                            spellCheck="false"
                            placeholder='Translation'>
                        </textarea>
                    </div>
                    <div>
                        <ul className='controls'>
                            <li className='row-from'>
                                <FiCopy />
                                <select></select>
                            </li>
                            <li className='exchange'>
                                <FaExchangeAlt />
                            </li>
                            <li className='row-to'>
                                <select></select>
                                <FiCopy />
                            </li>
                        </ul>
                    </div>
                    <button >Translate Text</button>
                </div>
            </div>
        </>
    )
}

export default Translate;