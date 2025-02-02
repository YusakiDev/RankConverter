import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { processPermissions } from './converter';

function App() {
  const [inputJson, setInputJson] = useState('');
  const [outputYaml, setOutputYaml] = useState('');

  const convertToYaml = () => {
    try {
      const jsonData = JSON.parse(inputJson);
      const processed = processPermissions(jsonData);
      
      let yamlOutput = 'permissions:\n';
      Object.entries(processed.permissions).forEach(([section, perms]) => {
        yamlOutput += `  ${section}\n`;
        Object.entries(perms).forEach(([perm, value]) => {
          yamlOutput += `  "${perm}": ""\n`;
        });
        yamlOutput += '\n';
      });

      setOutputYaml(yamlOutput);
      toast.success('Conversion successful!');
    } catch (error) {
      toast.error('Invalid JSON input!');
    }
  };

  const loadSampleJson = () => {
    const sampleJson = {
      "groups": {
        "admin": {
          "nodes": [
            {
              "type": "permission",
              "key": "grim.alerts.enable-on-join"
            },
            {
              "type": "weight",
              "key": "weight.100"
            }
          ]
        },
        "moderator": {
          "nodes": [
            {
              "type": "permission",
              "key": "grim.alerts.view"
            },
            {
              "type": "weight",
              "key": "weight.50"
            }
          ]
        }
      }
    };
    setInputJson(JSON.stringify(sampleJson, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputYaml);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-teal-600 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">JSON to YAML Converter</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-teal-700 mb-2">Input JSON</h2>
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              className="w-[2000px] h-[2000px] p-4 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Paste your JSON here..."
            />
          </div>

          <div className="flex flex-row gap-2 pt-10">
            <button
              onClick={loadSampleJson}
              className="px-4 py-2 bg-white text-teal-600 font-semibold rounded hover:bg-gray-200 transition shadow-sm"
            >
              Load Sample
            </button>
            <button
              onClick={convertToYaml}
              className="px-4 py-2 bg-white text-teal-600 font-semibold rounded hover:bg-gray-200 transition shadow-sm"
            >
              Convert
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-white text-teal-600 font-semibold rounded hover:bg-gray-200 transition shadow-sm"
            >
              Copy
            </button>
          </div>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-teal-700 mb-2">Output YAML</h2>
            <textarea
              value={outputYaml}
              readOnly
              className="w-[2000px] h-[2000px] p-4 bg-white border border-gray-300 rounded shadow-sm focus:outline-none"
              placeholder="Converted YAML will appear here..."
            />
          </div>
        </div>
      </main>

      <ToastContainer
        position="bottom-right"
        theme="colored"
        autoClose={3000}
      />
    </div>
  );
}

export default App; 