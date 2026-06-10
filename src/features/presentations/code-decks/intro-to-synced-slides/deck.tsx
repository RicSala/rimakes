import { Callout } from '@/shared/components/Callout';

import {
  BulletsSlide,
  CodeSlide,
  ImageSlide,
  SlideFrame,
  TitleSlide,
} from '../../templates';
import type { CodeDeck } from '../types';

const nextSlideSnippet = `function nextSlide(index: number): number {
  // The presenter broadcasts; everyone else just follows.
  return index + 1;
}`;

// The code-deck twin of content/decks/intro-to-synced-slides/index.mdoc — same
// five beats, authored as templates so /talk and /present are an A/B pair.
const deck: CodeDeck = {
  title: 'Intro to synced slides',
  slides: [
    <TitleSlide
      key='intro'
      eyebrow='Live demo'
      title='Synced slides'
      subtitle='Everyone in this room is looking at this exact slide — because I am.'
    />,
    <BulletsSlide
      key='how-it-works'
      title='How it works'
      items={[
        <>
          The deck is just <strong>React components</strong> — one per slide,
          composed from shared templates.
        </>,
        <>
          Each slide is an element in a <code>slides[]</code> array.
        </>,
        <>
          A single number — <em>“which slide are we on”</em> — is broadcast over
          Pusher.
        </>,
        <>
          Your browser shows <code>slides[index]</code>. That’s the whole trick.
        </>,
      ]}
    />,
    <SlideFrame key='late' className='items-center'>
      <div className='w-full max-w-2xl text-lg'>
        <Callout title='Late to the party?' emoji='👋' variant='info'>
          Refresh the page any time. You’ll jump straight to the slide we’re on —
          the cache channel replays the current position to anyone who joins.
        </Callout>
      </div>
    </SlideFrame>,
    <CodeSlide
      key='code'
      title='Templates work here too'
      code={nextSlideSnippet}
      language='ts'
      caption='Callouts, Shiki-highlighted code, shared templates — composed as components.'
    />,
    <ImageSlide
      key='image'
      src='/images/projects/flowpost.jpg'
      alt='Flowpost'
      title='Drop in an image'
      caption='Any file under /public — or a co-located import — works on a slide.'
    />,
    <TitleSlide
      key='end'
      eyebrow='That’s it'
      title='Questions?'
      subtitle='Author a deck, open the control screen, share the viewer link.'
    />,
  ],
};

export default deck;
