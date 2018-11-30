import { PropTypes } from "react";

export const PageShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
});

const names = [
  "Maegan Little",
  "Wilmer Parker",
  "Kristy Bauch",
  "Okey Beatty",
  "Kayleigh Gleason",
  "Elmo Hermann"
];

const loremIpsum = [
  `<p>Ab dolores deserunt cum quis vitae et similique eum. Ad omnis enim earum id excepturi. Iste itaque temporibus consequatur amet voluptatem et officia dolores. Id natus a exercitationem eum odio.</p>`,
  `<p>Rerum officia voluptas perspiciatis ea fugit. Corporis odio non eos dolor omnis cum fugit eius. Aut ut id velit cum aut sunt. In distinctio autem ipsa suscipit consequatur consequuntur dolorum ab.</p>`,
  `<p>Ab consequatur quidem velit voluptatibus beatae dolore. Autem saepe quia eaque ut ut voluptates rem omnis. Nihil et dolor accusantium laboriosam quas expedita eveniet. Magnam autem occaecati itaque totam incidunt quibusdam qui. Nulla in enim sit harum quia molestiae sit. Quia sit ipsam provident voluptatem aut.</p>`,
  `<p>Odio iste omnis esse facilis tempore accusamus sed. Blanditiis sed sit dolor consequatur animi deleniti. Nihil ut pariatur minima omnis et laboriosam. Voluptate adipisci corporis vitae consequatur et consequatur officia recusandae. Aut tempore assumenda molestiae.</p>`,
  `<p>Sed ratione adipisci quod minima quam ullam hic pariatur. Nostrum magni dolorem veniam amet assumenda quo iste rerum. Et cumque voluptatem ex odit odio atque. Natus ducimus necessitatibus amet veniam voluptatem labore fugit. Omnis beatae vel adipisci exercitationem odit tempore. Necessitatibus consequuntur neque animi eveniet eveniet.</p>`
];

export default basepath =>
  new Array(6).fill(null).map((_, index) => ({
    title: names[Math.floor(Math.random() * 6)],
    path: `${basepath}/${index}`,
    description: loremIpsum.slice(Math.floor(Math.random() * 5)).join(""),
    image: `http://lorempixel.com/768/160/food/${index}/20`
  }));
