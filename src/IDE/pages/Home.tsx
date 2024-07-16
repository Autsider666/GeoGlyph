import {ReactElement} from 'react';

function Home(): ReactElement {
    return (
        <div className='container has-text-centered'>
            <h1 className="is-size-1">TODO</h1>
            <ul>
                <li>A lot</li>
            </ul>
        </div>
    );
}

export default Home;
