import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { string } from 'prop-types';

interface TaxonomyItem {
  id?: string;
  text: string;
  children: string[];
};

type TaxonomyList = TaxonomyItem[];

type TaxonomyDataContextType = {
  issuesMap: Map<string, string[]>;
  priorityAreasMap: Map<string, string[]>;
};

const TaxonomyDataContext = createContext<TaxonomyDataContextType>({
  issuesMap: new Map<string, string[]>(),
  priorityAreasMap: new Map<string, string[]>()
});

const { Provider, Consumer } = TaxonomyDataContext;

const TaxonomyDataContextProvider = ({
  children: childNodes,
}: {
  children: JSX.Element;
}) => {
  const [issuesMap, setIssuesMap] = useState<Map<string, string[]>>(new Map());
  const [priorityAreasMap, setPriorityAreasMap] = useState<Map<string, string[]>>(new Map());

  useEffect(() => {
    const getData = async () => {
      const issues_resp = await axios.get(`https://api.taxonomy.sandbox.k8s.brigade.cloud/taxonomy?category=Issues`);
      const _issues_data = issues_resp.data
      const issues = _issues_data;

      // only take the children of the first object, this is the detailed list of taxonomy items
      const taxonomyIssues:TaxonomyList = issues[0].children;
      const issuesMapLocal = new Map<string, string[]>(taxonomyIssues.map(key => [key.text, key.children]));
      setIssuesMap(issuesMapLocal);

      const paa_resp = await axios.get(`https://api.taxonomy.sandbox.k8s.brigade.cloud/taxonomy?category=Priority-Action-Areas`);
      const _paa_data = paa_resp.data
      const priorityAreas = _paa_data;

      // only take the children of the first object, this is the detailed list of taxonomy items
      const taxonomyPriorityAreas:TaxonomyList = priorityAreas[0].children;
      const priorityAreasMapLocal = new Map<string, string[]>(taxonomyPriorityAreas.map(key => [key.text, key.children]));
      setPriorityAreasMap(priorityAreasMapLocal);
    }
    getData();
    // Disabling bc data length isn't going to change outside of this hook
    // eslint-disable-next-line
  }, []);


  return (
    <Provider
      value={{
        issuesMap: issuesMap,
        priorityAreasMap: priorityAreasMap
      }}
    >
      {childNodes}
    </Provider>
  );
};

export { TaxonomyDataContextProvider };
export { Consumer as TaxonomyDataConsumer };
export default TaxonomyDataContext;