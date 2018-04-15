import { renderComponent , expect } from '../test_helper';
import StationsChooser from '../../src/components/stations_chooser';
import WhichStation from '../../src/components/which_station';

// router support needed for Link
// describe('StationsChooser' , () => {
//   let component;

//   beforeEach(() => {
//     component = renderComponent(StationsChooser);
//   });

//   it('renders something', () => {
//     expect(component).to.exist;
//   });
// });

// needs middleware applied
// describe('WhichStation' , () => {
//   let component;

//   beforeEach(() => {
//     component = renderComponent(
//       WhichStation,
//       { match: { params: { choices: 'BRI-35--BPW-25', direction: 'from', target: 'PAD' } } }
//     );
//   });

//   it('renders something', () => {
//     expect(component).to.exist;
//   });
// });
