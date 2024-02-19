import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {

	const [repoUrl, setRepoUrl] = useState('https://github.com/facebook/react');
	const [pullRequestsData, setPullRequestsData] = useState([]);
	const [selectedMenuItem, setSelectedMenuItem] = useState('PULL_REQUESTS');

	const menuItems =[
		{
			name: 'Code',
			value:'CODE',
			// imageUrl:'/commentIcon.png'
		},
		{
			name: 'Issues',
			value:'ISSUES',
			// imageUrl:'/commentIcon.png'

		},
		{
			name: 'Pull requests',
			value:'PULL_REQUESTS',
			// imageUrl:'/commentIcon.png'

		},
		{
			name: 'Actions',
			value:'ACTIONS',
			// imageUrl:'/commentIcon.png'

		},
		{
			name: 'Projects',
			value:'PROJECTS',
			// imageUrl:'/commentIcon.png'

		},
		{
			name: 'Wiki',
			value:'WIKI',
			// imageUrl:'/commentIcon.png'

		},
		// {
		// 	name: 'Security',
		// 	value:'SECURITY',
		// 	imageUrl:'/commentIcon.png'

		// },
		// {
		// 	name: 'Insights',
		// 	value:'INSIGHTS',
		// 	imageUrl:'/commentIcon.png'

		// },
	]
	console.log('pull request data',pullRequestsData)

	const YOUR_PERSONAL_ACCESS_TOKEN = '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';
	
	const API_URL = 'https://api.github.com/';
	const axiosInstance = axios.create({
		headers: {
			Authorization: YOUR_PERSONAL_ACCESS_TOKEN,
		},
	});
	
	useEffect( ()=>{
		fetchPullRequests();
	},[]) 

	const repoPath1 = repoUrl.includes('github.com') ? repoUrl.split('github.com')[1] : repoUrl;
	console.log('temperary',repoPath1);

		
	const fetchPullRequests = async () => {
		try {

      const repoPath = repoUrl.includes('github.com') ? repoUrl.split('github.com')[1] : repoUrl;
			const repoPathNew = repoPath.includes('/pulls') ? repoPath.split('/pulls')[0] : repoPath;

      console.log('url',`${API_URL}repos${repoPathNew}/pulls`);

			const response = await axiosInstance.get(`${API_URL}repos${repoPathNew}/pulls`);

      if ( response?.status === 200){
				setPullRequestsData(response?.data);
			}	else{
				console.error('Something Is Wrong')
			}
	
		} catch (error) {
			console.error('Error fetching pull requests:', error);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		fetchPullRequests();
	};

	const fetchComments = async (pullRequest) => {
		try {
			const response = await axiosInstance.get(pullRequest.comments_url);
			console.log('comment response',response?.data);
			return response?.data?.length;        
		} catch (error) {
			console.error('Error fetching comments:', error);
			return 0;
		}
	};
// console.log('fetchComments',fetchingComments);
	useEffect(() => {
	  const fetchCommentsForPullRequests = async () => {
	    const pullRequestsWithComments = await Promise.all(
	      pullRequestsData.map(async (pr) => {
	        const numComments = await fetchComments(pr);
	        return { ...pr, numComments };
	      })
	    );
	    setPullRequestsData(pullRequestsWithComments);
	  };
	  fetchCommentsForPullRequests();
	}, [pullRequestsData]);

		
		// const fetchCommentsForPullRequests = async () => {
		// 	const pullRequestsWithComments = await Promise.all(
		// 		pullRequestsData.map(async (pr) => {
		// 			console.log('***',pr);
		// 			const numComments = await fetchComments(pr);
		// 			console.log('numComments',numComments)
		// 			return { ...pr, numComments };
		// 		})
		// 	);
		// 	setPullRequestsData(pullRequestsWithComments);
		// };

   const  onkeydownHandler = (e) => {
    console.log('evnt',e.target.value);
    if(e.key === "Enter"){
      fetchPullRequests();

    }
    // else{
    //   setRepoUrl(e.target.value);

    // }
    
   }

	return (
	 
	<div className='body'>
		<div className='mainbody'>
		<div className='header'>
			<div className='logo'>
					<img  src="/github.png"  width='50px' />
					<div style={{    marginLeft: '10px'}}>facebook / react</div>
			</div>
			{/* <div className='headerLeft' >
				<img src="/searchIcon.png" width= "18px" style={{margin:'0 10px'}}/>

				<input 
				  className='typeToSearch' 
				  type='search'

				  required/>
			</div> */}
			
		</div>
		<div className='menuSection'>
				{
					menuItems?.map(item => (
						<div key={item.value} onClick={() => setSelectedMenuItem(item.value)}  className={item.value === selectedMenuItem?'menuItem activeMenuItem' : 'menuItem' }>
							<img src={item.imageUrl} style={{marginRight:'15px'}}/>
							<div>{item.name}</div>
						</div>
					))
				}
			</div>
     	<div className='headerAndData'>
			
			<div className='headerSection'>
				<div className='filterSection'>
					<div className='filter'>Filter</div>
					<img src="/searchIcon.png" width= "18px" style={{margin:'0 10px'}}/>
				
					<input
						id="myInput"
						className='textBox'
						type="textArea"
						value={repoUrl}
						onChange={(e) => setRepoUrl(e.target.value)}
						// onChange={(e) => console.log(e.key)}
						onKeyDown={onkeydownHandler}
						required
					/>
				</div>
			</div>
		
			<div className='pullRequestContainer'>
				{pullRequestsData?.map((pr) => (
					<div className='pullRequestItem' key={pr.id}>
					<div className='titleContainer'>
						<div className='title'>{pr.title}</div>
						<div className='autherContainer'>
							<div className='auther'>Author </div>
							<div className='seperator'>: </div>
							<div className='autherName'>{pr.user.login}</div>
						</div>
					</div>
					<div className='iconAndCommend'>
						<img alt='comment-icon' src="/commentIcon.png" style={{marginRight:'5px'}} width="25px"/> 
						<div style={{marginLeft:'5px'}}>	{pr.numComments} </div>
					</div>
					</div>
				))}
			</div>
		</div>
		</div>
		
    </div>

	);
}

export default App;


