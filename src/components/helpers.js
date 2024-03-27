
const csvToJson = (csv) => {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(";");

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(";");

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }

    return result;
};


const jsonToCsv = (data) => {
    // Get the headers
    const headers = Object.keys(data[0]);

    // Map each item to a CSV row
    const rows = data.map(item => headers.map(header => item[header]).join(','));

    // Join all rows
    const csv = [headers.join(','), ...rows].join('\n');

    return csv;
}


const getMaxValue = (data) => {
    return Math.max(...data.map(item => item.valeur));
};

//
// donnée pour diagramme de dispersion  
//

function stringToFloat(s) {
    return parseFloat(s);
}

const getValue = (data) => {
    // Group by nom site and pollutant
    const groupedByNomSiteAndPollutant = data.reduce((acc, item) => {
        const key = `${item['nom site']}_${item.Polluant}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item.valeur);
        return acc;
    }, {});

    // Transform into desired format
    return Object.entries(groupedByNomSiteAndPollutant).map(([key, values]) => {
        const [nomSite, pollutant] = key.split('_');
        const floatValues = values.map(stringToFloat);
        return { 'nom site': nomSite, pollutant, valeurs: floatValues };
    });
}


//diagramme de dispersion par organisme
const getValueByOrganisme = (data, organisme) => {
    // Filter by organisme
    const filteredData = data.filter(item => item.Organisme === organisme);

    // Group by nom site and pollutant
    const groupedByNomSiteAndPollutant = filteredData.reduce((acc, item) => {
        const key = `${item['nom site']}_${item.Polluant}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item.valeur);
        return acc;
    }, {});

    // Transform into desired format
    return Object.entries(groupedByNomSiteAndPollutant).map(([key, values]) => {
        const [nomSite, pollutant] = key.split('_');
        const floatValues = values.map(stringToFloat);
        return { 'nom site': nomSite, pollutant, valeurs: floatValues };
    });
}


const transformDataByOrganisme = (data, organisme) => {
    // Get value for each nom site and pollutant
    const values = getValueByOrganisme(data, organisme);

    // Group values by nom site and calculate average
    const groupedByNomSite = values.reduce((acc, item) => {
        const { 'nom site': nomSite, pollutant, valeurs } = item;
        if (!acc[nomSite]) {
            acc[nomSite] = {};
        }
        if (!acc[nomSite][pollutant]) {
            acc[nomSite][pollutant] = { sum: 0, count: 0 };
        }
        valeurs.forEach(value => {
            if (!isNaN(value)) {
                acc[nomSite][pollutant].sum += value;
                acc[nomSite][pollutant].count += 1;
            }
        });
        return acc;
    }, {});

    // Transform into desired format with average values
    return Object.entries(groupedByNomSite).map(([nomSite, pollutants]) => {
        const pollutantsAvg = Object.entries(pollutants).reduce((acc, [pollutant, { sum, count }]) => {
            acc[pollutant] = sum / (count || 1);
            return acc;
        }, {});
        return { 'nom site': nomSite, ...pollutantsAvg };
    });
}




const calculateAverageFromTransformedData = (transformedData) => {
    // Flatten the data
    const flattenedData = transformedData.flatMap(item => 
        Object.entries(item).filter(([key]) => key !== 'nom site')
            .map(([pollutant, valeur]) => ({ 'nom site': item['nom site'], pollutant, valeur: valeur || 0 }))
    );

    // Group by nom site and pollutant
    const groupedByNomSiteAndPollutant = flattenedData.reduce((acc, item) => {
        const key = `${item['nom site']}_${item.pollutant}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item.valeur);
        return acc;
    }, {});

    // Calculate average for each group
    const averages = Object.entries(groupedByNomSiteAndPollutant).map(([key, values]) => {
        const [nomSite, pollutant] = key.split('_');
        const average = values.reduce((a, b) => a + b, 0) / (values.length || 1);
        return { 'nom site': nomSite, pollutant, average };
    });

    // Group averages by nom site
    const groupedByNomSite = averages.reduce((acc, item) => {
        if (!acc[item['nom site']]) {
            acc[item['nom site']] = {};
        }
        acc[item['nom site']][item.pollutant] = item.average;
        return acc;
    }, {});

    // Transform into desired format
    return Object.entries(groupedByNomSite).map(([nomSite, pollutants]) => ({
        'nom site': nomSite,
        ...pollutants
    }));
}





const transformData = (data) => {
    // Get value for each nom site and pollutant
    const values = getValue(data);
  
    // Group values by nom site and calculate average
    const groupedByNomSite = values.reduce((acc, item) => {
      const { 'nom site': nomSite, pollutant, valeurs } = item;
      if (!acc[nomSite]) {
        acc[nomSite] = {};
      }
      if (!acc[nomSite][pollutant]) {
        acc[nomSite][pollutant] = { sum: 0, count: 0 };
      }
  
      // Traiter les valeurs NaN comme 0
      acc[nomSite][pollutant].sum += valeurs.reduce((a, b) => {
        const numA = isNaN(a) ? 0 : a;
        const numB = isNaN(b) ? 0 : b;
        return numA + numB;
      }, 0);
  
      // Compter uniquement les valeurs non NaN
      acc[nomSite][pollutant].count += valeurs.filter(value => !isNaN(value)).length;
  
      return acc;
    }, {});
  
    // Transform into desired format with average values
    return Object.entries(groupedByNomSite).map(([nomSite, pollutants]) => {
      const pollutantsAvg = Object.entries(pollutants).reduce((acc, [pollutant, { sum, count }]) => {
        // Traiter le cas où count est 0 pour éviter la division par 0
        acc[pollutant] = count === 0 ? 0 : sum / count;
        return acc;
      }, {});
      return { 'nom site': nomSite, ...pollutantsAvg };
    });
  }


const getMaxValue2 = (data2) => {
    return Math.max(...data2.map(item => item.valeur));
};



const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const countNbLigne = (data) => {
    return data.length;
};


const countDistinctPollutants = (data) => {
    const pollutants = data.map(item => item.Polluant);
    const distinctPollutants = new Set(pollutants);
    return distinctPollutants.size;
};

const countDistinctSites = (data) => {
    const sites = data.map(item => item['nom site']);
    const distinctSites = new Set(sites);
    return distinctSites.size;
};

const countDistinctOrganismes = (data) => {
    const organismes = data.map(item => item.Organisme);
    const distinctOrganismes = new Set(organismes);
    return distinctOrganismes.size;
};

//dendrogramme


export { csvToJson, jsonToCsv, getMaxValue, getValue, calculateAverageFromTransformedData, transformData, getMaxValue2, formatDate, countNbLigne, countDistinctPollutants, countDistinctSites, countDistinctOrganismes, transformDataByOrganisme };