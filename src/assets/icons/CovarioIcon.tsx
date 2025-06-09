import LazyImage from '../../components/common/LazyImage';

const CovarioIcon = () => {
    return (
        <LazyImage
            style={{
                height: "2em",
                width: "2em",
            }}
            src="https://static.swissdevjobs.ch/logo-images/covario-ag-logo.jpg"
            alt="Covario AG jobs"
            title="Covario AG jobs"
            className="img-fluid job-details-company-image px-md-0"
        />
    );
}


export default CovarioIcon;
