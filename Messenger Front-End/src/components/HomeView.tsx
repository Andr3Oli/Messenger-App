import React from "react";

export interface IUsers {
	id: number,
	name: string,
}

export interface IFriends {
	fId: number,
	name: string,
}

export interface IMessages {
	mId: number,
	toId: number,
	fromId: number,
	mText: string,
	date: Date
}

const HomeView = ({ state }: any) => (
	<div className="App">
		<header className="header-Chat">
			<div className="header-left">
				<span className="header-Username">Hello, {state.name}</span>
			</div>
			<div className="header-center" style={{ marginLeft: "-4.5%" }}>
				<h1 className="header-Title">MECKASSENGER</h1>
			</div>
			<div className="header-right">
				<button className="header-Logout-button" onClick={state.showLoginView}>Logout</button>
			</div>
		</header>
		<div className="App-header-Chat">
			<div className='some-page-wrapper'>
				<div className='row'>
					<div className='column'>
						<span className="title">Friend List</span>
						<div className="list-container" style={{ overflowY: 'scroll', height: '250px' }}>
							<div className="people">
								{state.listFriend.map((users: IFriends) => {
									return (<div key={users.fId} style={{ width: "100%", overflow: "hidden" }}>
										<div style={{ width: "100px", float: "left" }}>
											<div className="person" style={{ float: "left" }}>
												<span className="name">{users.name}</span>
											</div>
										</div>
										<div style={{ marginLeft: "260px" }}>
											<button style={{ marginTop: "25px" }} onClick={() => state.openChat(users.name, users.fId)}> Chat </button>
											<button style={{ marginTop: "25px" }} value={JSON.stringify({ name: users.name, fId: users.fId })} onClick={state.removeFriends} > Remove Friend</button>
										</div>
									</div>)
								})}
							</div>
						</div>
						<div className="divider" style={{ backgroundColor: "white" }} />
						<div className="search-Bar">
							<div className="search">
								<input type="text" className="searchTerm" placeholder="Search Friends!" onClick={state.searchUsers} onChange={state.updateSearchTerm}></input>
							</div>
						</div>
						<div className="divider" style={{ backgroundColor: "white" }} />
						<div className="list-container" style={{ overflowY: 'scroll', height: '180px' }}>
							<div className="people">
								{state.listUsers.map((users: IUsers) => {
									return (<div key={users.id} style={{ width: "100%", overflow: "hidden" }}>
										<div style={{ width: "100px", float: "left" }}>
											<div className="person-Search" style={{ float: "left" }}>
												<span className="name" >{users.name}</span>
											</div>
										</div>
										<div style={{ marginLeft: "240px" }}>
											<button style={{ marginTop: "20px" }} value={JSON.stringify({ name: users.name, id: users.id })} onClick={state.addFriends}> Add Friend </button>
										</div>
									</div>)
								})}
							</div>
						</div>
					</div>
					<div className='double-column'>
						<div className='chat-column'>
							<div style={{ marginBottom: "20px", marginTop: "1%" }}>
								<span className="title">{state.fName} </span>
							</div>
							<div className="divider" />
							<div className="chat" style={{ margin: "10px" }}>
								<div className="messages">
									{state.listMessages.map((messages: IMessages) => {
										if (messages.fromId === state.uId) {
											return (
												<div className="message me" style={{ height: "auto" }}>
													{messages.mText}&nbsp;&nbsp;
													{!state.editMsg ? (
														<button style={{ color: "black", textAlign: "end" }} onClick={() => state.editMessage(messages.mId, messages.mText)} >[edit]</button>
													) : (
														<></>
													)}
												</div>
											)
										} else {
											return (
												<div className="message other" style={{ height: "auto", width: "400px" }}>
													{messages.mText}
												</div>
											)
										}
									})}
								</div>
								<div className="divider" />
								<div className="search" style={{ marginTop: "10px" }}>
									{state.chat ? (
										<>
											<input type="text" className="searchTerm" value={state.message} onChange={state.setMessage} placeholder="Write here"></input>
											{!state.editMsg ? (
												<button onClick={state.createMessage}>Send</button>
											) : (
												<button onClick={state.updateMessage}>Edit</button>
											)}
										</>
									) : (
										<div></div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

);


export default HomeView;