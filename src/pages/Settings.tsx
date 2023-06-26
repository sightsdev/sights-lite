import React, {useState, useEffect} from "react";
import {AppClient} from "../api";
import useApi from "../useApi";
import {Loader} from "../components/Loader";
import Editor from 'react-simple-code-editor';
import hljs from 'highlight.js';
import ini from 'highlight.js/lib/languages/ini';
import "highlight.js/styles/github.css";
import {FaArrowLeft, FaBackward, FaSave} from "react-icons/fa";
import {Button} from "../components/Button";
import toast from "react-hot-toast";
import {Link} from "react-router-dom";

hljs.registerLanguage('ini', ini);

function Settings() {
    const client = new AppClient({
        BASE: 'http://localhost:8000',
    });
    const {loading, data} = useApi(client.default.getSettingsSettingsGet());

    const [code, setCode] = useState('function test() {}\nconsole.log("hello");');


    useEffect(() => {
        if (data) {
            setCode(data)
        }
    }, [data])

    const saveSettings = async () => {
        await toast.promise(client.default.setSettingsSettingsPost({content: code}),
            {
                loading: 'Saving...',
                success: <b>Settings saved!</b>,
                error: <b>Could not save.</b>,
            })
    }

    if (loading || !data) return <Loader/>

    return (
        <div className="container mx-auto w-2/3 my-6 ">
            <p className="text-semibold text-xl my-6 inline-flex"><Link to={"/"} className={"rounded-md mr-2 px-2 pt-1"}><FaArrowLeft/></Link>Settings Editor</p>
            <div className="grid grid-cols-3 auto-cols-max gap-8">
                <div className="col-span-2 bg-gray-100 rounded-lg p-6">
                    <Editor
                        value={code}
                        onValueChange={code => setCode(code)}
                        highlight={code => hljs.highlight("ini", code).value}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                        }}
                    />
                </div>


                <div className="">
                    <div className="bg-gray-100 rounded-lg p-6 sticky top-4">
                        <Button onClick={() => saveSettings()}
                                color="text-sky-700 hover:text-white border border-sky-800 hover:bg-sky-800"><FaSave
                            className="mr-2"/> Save Settings</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;
