import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { GrDocumentPdf } from "react-icons/gr";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,  AreaChart, BarChart, Area, Bar,RadarChart,Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,PieChart, Pie } from 'recharts';
import 'react-datepicker/dist/react-datepicker.css';
import { ResponsiveContainer } from 'recharts';
import { ScatterChart, Scatter } from 'recharts';
import { getMaxValue, transformData, formatDate, csvToJson, countDistinctPollutants, countNbLigne,countDistinctSites, countDistinctOrganismes} from './helpers';
// import coord from './coord.csv';
import {Cell} from 'recharts';
import { PureComponent } from 'react';
import {ComposedChart} from 'recharts';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';



import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button } from './ui/button';
import MapComponent from './menu/MapComponent';



const Dashboardrecup = () => {

    const pdRef = useRef();

    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSecondDate, setSelectedSecondDate] = useState(new Date());
    const [selectedPollutant, setSelectedPollutant] = useState('');
    const [selectedSecondPollutant, setSelectedSecondPollutant] = useState('');
    const [selectedSite, setSelectedSite] = useState('');
    const [selectedSecondSite, setSelectedSecondSite] = useState('');
    const [pollutants, setPollutants] = useState([]);
    const [sites, setSites] = useState([]);
    const [dateSelected, setDateSelected] = useState(false);
    const [isComparing, setIsComparing] = useState(false);

    const position = [48.8566, 2.3522]; // Coordonnées de Paris, France


    const [isSwapped1, setIsSwapped1] = useState(true);
    const [isSwapped2, setIsSwapped2] = useState(true);
    const [isSwapped3, setIsSwapped3] = useState(true);

    const [comparer, setComparer] = useState(true);



    const convertToPDF = () => {
        const input = pdRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('invoice.pdf');
    });
    };

    const handleDoubleClick = () => {
        setIsSwapped1(!isSwapped1);
    };
    const handleDoubleClick2 = () => {
        setIsSwapped2(!isSwapped2);
    };
    const handleDoubleClick3 = () => {
        setIsSwapped3(!isSwapped3);
    };

    const [currentStatistic, setCurrentStatistic] = useState(0);
    const statistics = [
        { title: "Nombre de polluants:", count: countDistinctPollutants(data) - 1, color: "bg-teal-500" },
        { title: "Nombre de mesures:", count: countNbLigne(data) - 1, color: "bg-blue-500" },
        { title: "Nombre de sites:", count: countDistinctSites(data) - 1, color: "bg-pink-500" },
        { title: "Nombre d'organismes:", count: countDistinctOrganismes(data) - 1, color: "bg-yellow-500" }
    ];

    const handleDoubleClick4 = () => {
        setCurrentStatistic((currentStatistic + 1) % statistics.length);
    };

    const [currentStatistic2, setCurrentStatistic2] = useState(0);
    const statistics2 = [
        { title: "Nombre de polluants:", count: countDistinctPollutants(data2) - 1, color: "bg-teal-500" },
        { title: "Nombre de mesures:", count: countNbLigne(data2) - 1, color: "bg-blue-500" },
        { title: "Nombre de sites:", count: countDistinctSites(data2) - 1, color: "bg-pink-500" },
        { title: "Nombre d'organismes:", count: countDistinctOrganismes(data2) - 1, color: "bg-yellow-500" }
    ];

    const handleDoubleClick5 = () => {
        setCurrentStatistic2((currentStatistic2 + 1) % statistics2.length);
    };






    const geodairAPI = {
        baseUrl: "http://localhost:3001/api/data",
        fetchData: async function (selectedDate, fileName) {
            let url = `${this.baseUrl}/${selectedDate}/${fileName}`;

            try {
                let response = await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        `Réponse HTTP erronée : ${response.status} - ${response.statusText}`
                    );
                }

                const file = await response.text();
                const jsonData = csvToJson(file);
                setData(jsonData);
                const uniquePollutants = [...new Set(jsonData.map(item => item.Polluant))];
                setPollutants(uniquePollutants);
                const uniqueSites = [...new Set(jsonData.map(item => item['nom site']))];
                setSites(uniqueSites);
            } catch (error) {
                console.error("Error:", error);
            }
        },


        fetchData2: async function (selectedSecondDate, fileName2) {
            let url = `${this.baseUrl}/${selectedSecondDate}/${fileName2}`;

            try {
                let response = await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        `Réponse HTTP erronée : ${response.status} - ${response.statusText}`
                    );
                }

                const file = await response.text();
                const jsonData = csvToJson(file);
                setData2(jsonData);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            let selectedDateFormatted = formatDate(selectedDate);
            const fileName = `FR_E2_${selectedDateFormatted}.csv`;
            await geodairAPI.fetchData(selectedDateFormatted, fileName);
            setDateSelected(true);
        };
    
        fetchData();
    }, [selectedDate]);


    

    const handleFetchData = () => {
        const selectedDateFormatted = formatDate(selectedDate);
        const fileName = `FR_E2_${selectedDateFormatted}.csv`;
        const year = selectedDate.getFullYear();
        geodairAPI.fetchData(year, fileName);
   
        // const transformedData = transformData(data);
        // const averages = calculateAverageFromTransformedData(transformedData);

        if (isComparing) {
            const selectedSecondDateFormatted = formatDate(selectedSecondDate);
            const fileName2 = `FR_E2_${selectedSecondDateFormatted}.csv`;
            const year2 = selectedSecondDate.getFullYear();
            geodairAPI.fetchData2(year2, fileName2);

        }
    };


    
    const handlePollutantChange = (pollutant) => {
        setSelectedPollutant(pollutant);
        const filteredSites = data
            .filter(item => item.Polluant === pollutant)
            .map(item => item['nom site']);
        setSites([...new Set(filteredSites)]);

        if (isComparing) {
            const filteredSites2 = data2
                .filter(item => item.Polluant === pollutant)
                .map(item => item['nom site']);
            setSites([...new Set(filteredSites2.concat(filteredSites))]);
            }
    };

    const handleSecondPollutantChange = (pollutant) => {
        setSelectedSecondPollutant(pollutant);
    };

    const toggleComparing = () => {
        setIsComparing(!isComparing);
    };

    const toggle = () => {
        setComparer(!comparer); 
    }

    const renderSecondSection = () => {
        if (isComparing) {
            return (
                
                <div className="flex flex-col md:flex-row items-start md:items-center">
                    
                    <div className="w-30 md:mx-2 mb-4 md:mb-0">
                        <DatePicker
                            selected={selectedSecondDate}
                            onChange={(date) => {
                                setSelectedSecondDate(date);
                                handleFetchData();
                            }}
                            
                            dateFormat="dd/MM/yyyy"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="w-30 mt-4 md:mt-0 pl-3">
                        <select
                            value={selectedSecondPollutant}
                            onChange={(e) => handleSecondPollutantChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Sélectionnez un polluant</option>
                            {pollutants.map(pollutant => (
                                <option key={pollutant} value={pollutant}>{pollutant}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-30 mt-4 md:mt-0 pl-3">
                        <select
                            value={selectedSecondSite}
                            onChange={(e) => setSelectedSecondSite(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Sélectionnez un site</option>
                            {sites.map(site => (
                                <option key={site} value={site}>{site}</option>
                            ))}
                        </select>
                    </div>

                    <div className='w-30 mt-4 md:mt-0 pl-3'>
                        <button onClick={toggle} className="w-full ml-auto  px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                            {comparer ? 'Graph 2 ' : 'Graph 1'}
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    };
    
    

    const MyScatterChart = () => {
        // Récupérer les données transformées
        const transformedData = transformData(data);
        
        // Filtrer les données pour inclure uniquement les deux sites sélectionnés
        const selectedSitesData = transformedData.filter(item => item['nom site'] === selectedSite || item['nom site'] === selectedSecondSite);
    
        // Mapper les données pour ScatterChart
        const scatterChartData = selectedSitesData.map((item, index) => ({
            'nom site': item['nom site'],
            [selectedPollutant]: parseFloat(item[selectedPollutant]), // Convertir en nombre
            [selectedSecondPollutant]: parseFloat(item[selectedSecondPollutant]), // Convertir en nombre
            fill: COLORS[index % COLORS.length] // Utiliser une couleur différente pour chaque site
        }));
    
        return (
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey={selectedPollutant} name={selectedPollutant} unit=" unit" />
                    <YAxis type="number" dataKey={selectedSecondPollutant} name={selectedSecondPollutant} unit="unit" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    {scatterChartData.map((siteData, index) => (
                        <Scatter key={index} name={siteData['nom site']} data={[siteData]} fill={siteData.fill} />
                    ))}
                    <Legend />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };
    
    // Couleurs pour chaque site
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f0e', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
    
    
    

    const MyLineChart = () => {
        const filteredData = data.filter(item => item.Polluant === selectedPollutant && item['nom site'] === selectedSite);
        const filteredData2 = data2.filter(item => item.Polluant === selectedSecondPollutant && item['nom site'] === selectedSecondSite);
        const max = Math.max(getMaxValue(filteredData), getMaxValue(filteredData2)); // Get the maximum value from both sets of data
        return (




            <ResponsiveContainer width="100%" height="100%">


                <LineChart
                    data={filteredData}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date de début" />
                    <YAxis domain={[0, max]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="valeur" stroke="#8884d8" />
                    {isComparing && <Line type="monotone" dataKey="valeur" stroke="#82ca9d" data={filteredData2} />} {/* Add another line for the second set of data */}
                </LineChart>
            </ResponsiveContainer>
        );
    };

    

    const MyRadar = () => {
        const filteredData = data.filter(item => item['nom site'] === selectedSite);
        const filteredData2 = data2.filter(item => item['nom site'] === selectedSecondSite);
    
        const radarData = [
            'NO', 'NO2', 'NOX as NO2', 'PM2.5', 'O3', 'PM10'
        ].map(subject => {
            const maxValueA = Math.max(
                getMaxValue(filteredData.filter(item => item.Polluant === subject)),
                -Infinity
            );
            const maxValueB = Math.max(
                getMaxValue(filteredData2.filter(item => item.Polluant === subject)),
                -Infinity
            );
    
            return {
                subject,
                A: maxValueA === -Infinity ? 0 : maxValueA,
                B: maxValueB === -Infinity ? 0 : maxValueB,
                fullMark: 150,
            };
        });
    
        console.log(radarData);
    
        return (
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name={selectedSite} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name={selectedSecondSite} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        );
    };
    
    
    
    


    const MyBarChart = () => {
        const filteredData = data.filter(item => item.Polluant === selectedPollutant && (item['nom site'] === selectedSite || item['nom site'] === selectedSecondSite));
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom site" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valeur" fill="#8884d8" />
                    {isComparing && <Bar dataKey="valeur" fill="#82ca9d" />} {/* Optionnel */}
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const MyBiaxalBarChart = () => {
        // Filtrer les données pour le premier polluant sélectionné et le site sélectionné
        const filteredData = data.filter(item => item.Polluant === selectedPollutant && item['nom site'] === selectedSite);
        const filteredData2 = data.filter(item => item.Polluant === selectedSecondPollutant && item['nom site'] === selectedSecondSite);
    
        // Création du tableau de données à afficher dans le graphique
        const dataToDisplay = Array.from({ length: 24 }, (_, index) => ({
            name: (filteredData[index] && filteredData[index]['Date de début']) || "Unknown Date",
            [selectedPollutant]: filteredData[index] ? filteredData[index].valeur : 0,
            [selectedSecondPollutant]: filteredData2[index] ? filteredData2[index].valeur : 0
        }));
    
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataToDisplay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey={selectedPollutant} fill="#8884d8" name={selectedPollutant} />
                    <Bar yAxisId="right" dataKey={selectedSecondPollutant} fill="#82ca9d" name={selectedSecondPollutant} />
                </BarChart>
            </ResponsiveContainer>
        );
    };
    
    const MyStackedAreaChart = () => {
        // Filtrer les données pour le premier polluant sélectionné et le site sélectionné
        const filteredData = data.filter(item => item.Polluant === selectedPollutant && item['nom site'] === selectedSite);
        const filteredData2 = data.filter(item => item.Polluant === selectedSecondPollutant && item['nom site'] === selectedSecondSite);
    
        // Création du tableau de données à afficher dans le graphique
        const dataToDisplay = Array.from({ length: 24 }, (_, index) => ({
            name: (filteredData[index] && filteredData[index]['Date de début']) || "Unknown Date",
            [selectedPollutant]: filteredData.length > index ? filteredData[index].valeur : 0,
            [selectedSecondPollutant]: filteredData2.length > index ? filteredData2[index].valeur : 0
        }));
    
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    
                    data={dataToDisplay}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone"   dataKey={selectedPollutant} stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone"  dataKey={selectedSecondPollutant} stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
            </ResponsiveContainer>
        );
    };
    const onChange = date => {
        setSelectedDate(date);
        handleFetchData(); // Assurez-vous de définir cette fonction pour mettre à jour les données lorsque la date est modifiée
    };
    const onChange2 = date2 => {
        setSelectedSecondDate(date2);
        handleFetchData(); // Assurez-vous de définir cette fonction pour mettre à jour les données lorsque la date est modifiée
    };


    
   
    const MyPieChart = () => {
        const transformedData = transformData(data);
        const selectedSitesData = transformedData.filter(item => item['nom site'] === selectedSite);
      
        // Obtenir la liste des polluants triés par ordre décroissant des valeurs totales
        const polluantsTotaux = {};
        selectedSitesData.forEach(item => {
          Object.entries(item).forEach(([pollutant, value]) => {
            if (pollutant !== 'nom site') {
              polluantsTotaux[pollutant] = (polluantsTotaux[pollutant] || 0) + value;
            }
          });
        });
        const polluantsTries = Object.entries(polluantsTotaux).sort((a, b) => b[1] - a[1]).map(([pollutant]) => pollutant);
      
        const pieChartData = polluantsTries.map(polluant => {
          const total = selectedSitesData.reduce((acc, item) => acc + parseFloat(item[polluant]), 0);
          return { name: polluant, value: total };
      });
      
        return (
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}:${parseFloat(value).toFixed(1)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <Tooltip />
                  <Legend />
          </ResponsiveContainer>
        );
    };

      


    const MyPieChart2 = () => {
        const transformedData = transformData(data);
        const selectedSitesData = transformedData.filter(item => item['nom site'] === selectedSecondSite);
      
        // Obtenir la liste des polluants triés par ordre décroissant des valeurs totales
        const polluantsTotaux = {};
        selectedSitesData.forEach(item => {
          Object.entries(item).forEach(([pollutant, value]) => {
            if (pollutant !== 'nom site') {
              polluantsTotaux[pollutant] = (polluantsTotaux[pollutant] || 0) + value;
            }
          });
        });
        const polluantsTries = Object.entries(polluantsTotaux).sort((a, b) => b[1] - a[1]).map(([pollutant]) => pollutant);
      
        const pieChartData = polluantsTries.map(polluant => {
          const total = selectedSitesData.reduce((acc, item) => acc + parseFloat(item[polluant]), 0);
          return { name: polluant, value: total };
      });
      
        return (
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}:${parseFloat(value).toFixed(1)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <Tooltip />
                  <Legend />
          </ResponsiveContainer>
        );
    };
      

    



    // function fetchDataAndConvertToJson() {
    //     return fetch(coord)
    //       .then(response => response.text())
    //       .then(data => {
    //         return csvToJson(data);
    //       });
    //   }
    //     const MyMap = () => {
    //       const [mergedData, setMergedData] = useState([]);
        
    //       useEffect(() => {
    //         fetchDataAndConvertToJson()
    //           .then(jsonData => {
    //             const transformedData = transformData(data);
    //             const mergedData = transformedData.map(dataObj => {
    //               const matchjsondata = jsonData.find(
    //                 jsonObj =>
    //                   jsonObj["code station"] === dataObj["code station"] 
                      
    //               );
                  
    //               if (matchjsondata) {
    //                 let latitude = parseFloat(matchjsondata.Latitude.replace(",", "."));
    //                 let longitude = parseFloat(matchjsondata.Longitude.replace(",", "."));
    //                 console.log(latitude, longitude);
    //                 return { ...dataObj, latitude: latitude, longitude: longitude };
    //               } else {
                     
    //                 return dataObj;
    //               }
    //             });
    //             setMergedData(mergedData);
    //           });
    //       }, []);
        
    //       return (
    //         <>
            
            
    //           <MapContainer center={position} zoom={6} style={{ height: '730px', width: '100%' }}>
    //             <TileLayer
    //               // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?key=q5ys1RZA0YUSXpDxGDcU"
    //               url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    //               attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //             />
    //             {mergedData.map((item, index) => {
    //               const { latitude, longitude } = item;
    //               console.log(index);
                
    //               // Vérifier si les coordonnées sont définies et valides
    //               if (latitude !== undefined && longitude !== undefined) {
                      
    //                 return (
    //                   <Marker key={index} position={[latitude, longitude]}>
    //                   <Popup>
    //                     {/* Contenu du popup pour chaque marqueur */}
    //                     <div>
    //                       <h3>{item["code station"]}</h3>
    //                       <p>Latitude: {latitude}</p>
    //                       <p>Longitude: {longitude}</p>
    //                       {/* Autres informations à afficher */}
    //                     </div>
    //                   </Popup>
    //                 </Marker>
    //                 );
    //               }
    //               // Si les coordonnées sont invalides, ne pas créer le marqueur
               
    //             })}
    //           </MapContainer>
      
    //         </>
    //       );
    //   };

    
    return (

        <>
    
        <div className="max-w-7xl mx-auto" ref= {pdRef}>
            <div className="grid md:grid-cols-4 auto-rows-[140px] gap-3 my-10">

                <div className =" bg-neutral-100 border-2 rounded-xl p-2  md col-span-4 row-span-1">

                    <div className="flex flex-row md:flex-row items-start md:items-center">
                                <div className="w-30  md:mr-2 mb-4 md:mb-0">
                                    <DatePicker
                                        
                                        //on fait en sort que handleFetchData soit appelé lorsqu'on selectionne une date

                                        selected={selectedDate}
                                        onChange={(date) => {
                                            setSelectedDate(date);
                                            handleFetchData(); // Appel automatique de la fonction pour récupérer les données dès que la date est sélectionnée
                                        }}                        dateFormat="dd/MM/yyyy"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {dateSelected && (
                                    <>
                                        <div className="w-30 md:mx-2 mb-4 md:mb-0">
                                            <select
                                                value={selectedPollutant}
                                                onChange={(e) => handlePollutantChange(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">Sélectionnez un polluant</option>
                                                {pollutants.map(pollutant => (
                                                    <option key={pollutant} value={pollutant}>{pollutant}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="w-30 mt-4 md:mt-0 pl-3">
                                            <select
                                                value={selectedSite}
                                                onChange={(e) => setSelectedSite(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">Sélectionnez un site</option>
                                                {sites.map(site => (
                                                    <option key={site} value={site}>{site}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="w-30 mt-4 md:mt-0 pl-3">
                                        <button
                                                onClick={toggleComparing}
                                                className="w-full ml-auto  px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                            >
                                                {isComparing ? 'Annuler la comparaison' : 'Comparer'}
                                        </button>

                                        </div>

                                        <div className="w-30 mt-4 md:mt-0 pl-3">
                                            {/* <button className="w-full ml-auto  px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={convertToPDF}>Convertir en PDF</button> */}
                                            <p>save</p>
                                            <GrDocumentPdf className='bg-white text-2xl rounded cursor-pointer ' onClick={convertToPDF}/>
                                        </div>

                                </>
                            )}
                    </div>
           
                    <br />
                    {renderSecondSection()}
                    <br />


                </div>

                <div className ={`${statistics[currentStatistic].color} border-2 rounded-xl p-2  ${!isSwapped2? "hidden": "col-span-1"} `} onDoubleClick={handleDoubleClick4}>
                    {/* <div className={`${statistics[currentStatistic].color} rounded-lg shadow-md p-4`}> */}
                        <h2 className="text-lg font-semibold mb-2 text-white">{statistics[currentStatistic].title}</h2>
                        <p className="text-2xl font-bold text-white">{statistics[currentStatistic].count}</p>
                    {/* </div> */}
                </div>

                <div className ={`${statistics2[currentStatistic2].color} border-2 rounded-xl p-2  ${!isSwapped2? "hidden": "col-span-1"} `} onDoubleClick={handleDoubleClick5}>
                        <h2 className="text-lg font-semibold mb-2 text-white">{statistics2[currentStatistic2].title}</h2>
                        <p className="text-2xl font-bold text-white">{statistics2[currentStatistic2].count}</p>
                </div>

                <div className={`bg-neutral-100 border-2 rounded-xl p-2  ${isSwapped1 ? 'md col-span-2' : 'col-span-2 row-span-2'}`} onDoubleClick={handleDoubleClick}>
                    <div className="border border-gray-300 h-full">
                        <MyLineChart />
                    </div>
                </div>

                <div className={`bg-neutral-100 border-2 rounded-xl p-2  md ${isSwapped2?'col-span-2': "col-span-2 row-span-2"}`} onDoubleClick={handleDoubleClick2}>
                    <div className="border border-gray-300 h-full">
                        <MyBiaxalBarChart />
                    </div>

                    
                </div>

                <div className={`bg-neutral-100 border-2 rounded-xl p-2  ${!isSwapped1 ? 'md col-span-2 ' : 'col-span-2 row-span-2'} `} onDoubleClick={ handleDoubleClick}>
                    <div className="border border-gray-300 h-full">
                        <MapComponent/>
                    </div>

                </div>

                <div className=" bg-neutral-100 border-2 rounded-xl p-2     md  row-span-2">
                    {/* <h2 className="text-xl text-gray-600">objet6</h2> */}
                    <div className="border border-gray-300 h-full">
                        <MyRadar/>
                    </div>
                </div>

                <div className=" bg-neutral-100 border-2 rounded-xl p-2   md  row-span-2">
                    <div className="border border-gray-300 h-full">
                            {comparer?  <MyPieChart/> : <MyPieChart2/>}
                    </div>
                </div>

                

                <div className={`bg-neutral-100 border-2 rounded-xl p-2 r md ${isSwapped3?"col-span-2": "col-span-2 row-span-2"}`} onDoubleClick={handleDoubleClick3}>
                        <div className="border border-gray-300 h-full">
                            <MyStackedAreaChart/>
                        </div>
                    
                </div>

                
            </div>
        </div>

        </>
    );
};



export default Dashboardrecup;