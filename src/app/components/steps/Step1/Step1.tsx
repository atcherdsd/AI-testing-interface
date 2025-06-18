import css from './Step1.module.scss';
import Heading from '../../ui/Heading/Heading';
import PageData from '@/data/index.json';
import LoadingBlock from '../../blocks/LoadingBlock/LoadingBlock';

export default function Step1() {
    const stepData = PageData.step1;
    const loadingBlocks = stepData.loadingBlocks;
    const errorMessage = stepData.errorMessage;

    return (
        <section className={css.root}>
            <Heading id='upload-title' {...stepData.heading} />
            <p className='visually-hidden'>{stepData.descriptionWhere}</p>

            <form className={css.rootLoadingContainer} aria-labelledby='upload-title'>
                {loadingBlocks.map((block, i) => (
                    <LoadingBlock
                        className={css.rootLoadingBlock}
                        key={block.capture}
                        index={i}
                        capture={block.capture}
                        errorMessage={errorMessage}
                    />
                ))}
            </form>
        </section>
    )
}
