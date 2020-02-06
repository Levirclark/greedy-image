import React from 'react';
import { withSize, SizeMeProps } from 'react-sizeme'

interface GreedyImageProps extends SizeMeProps, React.ImgHTMLAttributes<HTMLImageElement> {
    waitingTime: number;
    defaultImageSrc: string;
};

interface GreedyImageState {
    width: number;
    height: number;
    prepped: boolean;
    queuedUpdates: number;
}

class GreedyImage extends React.Component <GreedyImageProps, GreedyImageState> {
    constructor(props: GreedyImageProps) {
        super(props);
        this.state = {
            height: 0,
            width: 0,
            prepped: false,
            queuedUpdates: 0
        }
    }

    static defaultProps = {
        waitingTime: 100,
        defaultImageSrc: ''
    }
    
    render() {
        if(!this.state.prepped) {
            return <img src={this.props.defaultImageSrc}/>
        }
        const newUrl = new URL(this.props.src || '');
        newUrl.searchParams.set('width', this.state.width.toString());
        newUrl.searchParams.set('height', this.state.height.toString());
        return <img {...this.props} width={this.state.width} height={this.state.height} src={newUrl.toString()}/>
    }

    useNewDimensions() {
        this.setState({
            queuedUpdates: this.state.queuedUpdates + 1,
            width: this.props.size.width || 0,
            height: this.props.size.height || 0,
            prepped: false
        });

    }

    finishSizingStopwatch() {
        if(this.state.queuedUpdates === 1) {
            this.setState({
                queuedUpdates: this.state.queuedUpdates - 1,
                prepped: true
            });
        }
        else {
            this.setState({
                queuedUpdates: this.state.queuedUpdates - 1
            });
        }
    }

    componentDidUpdate(prevProps: GreedyImageProps, prevState: GreedyImageState) {
        if(this.props.size.height !== prevProps.size.height || this.props.size.width !== prevProps.size.width) {
            this.useNewDimensions();
        }
    }

    componentDidMount() {
        this.useNewDimensions();
    }
}

const WrappedGreedyImage = withSize({monitorHeight: true})(GreedyImage);

export default WrappedGreedyImage;