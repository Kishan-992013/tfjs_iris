/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { monitorPromisesProgress } from './progress';
describe('util.monitorPromisesProgress', () => {
    it('Default progress from 0 to 1', (done) => {
        const expectFractions = [0.25, 0.50, 0.75, 1.00];
        const fractionList = [];
        const tasks = Array(4).fill(0).map(() => {
            return Promise.resolve();
        });
        monitorPromisesProgress(tasks, (progress) => {
            fractionList.push(parseFloat(progress.toFixed(2)));
        }).then(() => {
            expect(fractionList).toEqual(expectFractions);
            done();
        });
    });
    it('Progress with pre-defined range', (done) => {
        const startFraction = 0.2;
        const endFraction = 0.8;
        const expectFractions = [0.35, 0.50, 0.65, 0.80];
        const fractionList = [];
        const tasks = Array(4).fill(0).map(() => {
            return Promise.resolve();
        });
        monitorPromisesProgress(tasks, (progress) => {
            fractionList.push(parseFloat(progress.toFixed(2)));
        }, startFraction, endFraction).then(() => {
            expect(fractionList).toEqual(expectFractions);
            done();
        });
    });
    it('throws error when progress fraction is out of range', () => {
        expect(() => {
            const startFraction = -1;
            const endFraction = 1;
            const tasks = Array(4).fill(0).map(() => {
                return Promise.resolve();
            });
            monitorPromisesProgress(tasks, (progress) => { }, startFraction, endFraction);
        }).toThrowError();
    });
    it('throws error when startFraction more than endFraction', () => {
        expect(() => {
            const startFraction = 0.8;
            const endFraction = 0.2;
            const tasks = Array(4).fill(0).map(() => {
                return Promise.resolve();
            });
            monitorPromisesProgress(tasks, (progress) => { }, startFraction, endFraction);
        }).toThrowError();
    });
    it('throws error when promises is null', () => {
        expect(() => {
            monitorPromisesProgress(null, (progress) => { });
        }).toThrowError();
    });
    it('throws error when promises is empty array', () => {
        expect(() => {
            monitorPromisesProgress([], (progress) => { });
        }).toThrowError();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NfdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvaW8vcHJvZ3Jlc3NfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFbkQsUUFBUSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtJQUM1QyxFQUFFLENBQUMsOEJBQThCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUMxQyxNQUFNLGVBQWUsR0FBYSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNELE1BQU0sWUFBWSxHQUFhLEVBQUUsQ0FBQztRQUNsQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDdEMsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDSCx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFnQixFQUFFLEVBQUU7WUFDbEQsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNYLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDOUMsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDN0MsTUFBTSxhQUFhLEdBQUcs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QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge21vbml0b3JQcm9taXNlc1Byb2dyZXNzfSBmcm9tICcuL3Byb2dyZXNzJztcblxuZGVzY3JpYmUoJ3V0aWwubW9uaXRvclByb21pc2VzUHJvZ3Jlc3MnLCAoKSA9PiB7XG4gIGl0KCdEZWZhdWx0IHByb2dyZXNzIGZyb20gMCB0byAxJywgKGRvbmUpID0+IHtcbiAgICBjb25zdCBleHBlY3RGcmFjdGlvbnM6IG51bWJlcltdID0gWzAuMjUsIDAuNTAsIDAuNzUsIDEuMDBdO1xuICAgIGNvbnN0IGZyYWN0aW9uTGlzdDogbnVtYmVyW10gPSBbXTtcbiAgICBjb25zdCB0YXNrcyA9IEFycmF5KDQpLmZpbGwoMCkubWFwKCgpID0+IHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9KTtcbiAgICBtb25pdG9yUHJvbWlzZXNQcm9ncmVzcyh0YXNrcywgKHByb2dyZXNzOiBudW1iZXIpID0+IHtcbiAgICAgIGZyYWN0aW9uTGlzdC5wdXNoKHBhcnNlRmxvYXQocHJvZ3Jlc3MudG9GaXhlZCgyKSkpO1xuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgZXhwZWN0KGZyYWN0aW9uTGlzdCkudG9FcXVhbChleHBlY3RGcmFjdGlvbnMpO1xuICAgICAgZG9uZSgpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnUHJvZ3Jlc3Mgd2l0aCBwcmUtZGVmaW5lZCByYW5nZScsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgc3RhcnRGcmFjdGlvbiA9IDAuMjtcbiAgICBjb25zdCBlbmRGcmFjdGlvbiA9IDAuODtcbiAgICBjb25zdCBleHBlY3RGcmFjdGlvbnM6IG51bWJlcltdID0gWzAuMzUsIDAuNTAsIDAuNjUsIDAuODBdO1xuICAgIGNvbnN0IGZyYWN0aW9uTGlzdDogbnVtYmVyW10gPSBbXTtcbiAgICBjb25zdCB0YXNrcyA9IEFycmF5KDQpLmZpbGwoMCkubWFwKCgpID0+IHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9KTtcbiAgICBtb25pdG9yUHJvbWlzZXNQcm9ncmVzcyh0YXNrcywgKHByb2dyZXNzOiBudW1iZXIpID0+IHtcbiAgICAgIGZyYWN0aW9uTGlzdC5wdXNoKHBhcnNlRmxvYXQocHJvZ3Jlc3MudG9GaXhlZCgyKSkpO1xuICAgIH0sIHN0YXJ0RnJhY3Rpb24sIGVuZEZyYWN0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgIGV4cGVjdChmcmFjdGlvbkxpc3QpLnRvRXF1YWwoZXhwZWN0RnJhY3Rpb25zKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBlcnJvciB3aGVuIHByb2dyZXNzIGZyYWN0aW9uIGlzIG91dCBvZiByYW5nZScsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhcnRGcmFjdGlvbiA9IC0xO1xuICAgICAgY29uc3QgZW5kRnJhY3Rpb24gPSAxO1xuICAgICAgY29uc3QgdGFza3MgPSBBcnJheSg0KS5maWxsKDApLm1hcCgoKSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgbW9uaXRvclByb21pc2VzUHJvZ3Jlc3MoXG4gICAgICAgICAgdGFza3MsIChwcm9ncmVzczogbnVtYmVyKSA9PiB7fSwgc3RhcnRGcmFjdGlvbiwgZW5kRnJhY3Rpb24pO1xuICAgIH0pLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGVycm9yIHdoZW4gc3RhcnRGcmFjdGlvbiBtb3JlIHRoYW4gZW5kRnJhY3Rpb24nLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXJ0RnJhY3Rpb24gPSAwLjg7XG4gICAgICBjb25zdCBlbmRGcmFjdGlvbiA9IDAuMjtcbiAgICAgIGNvbnN0IHRhc2tzID0gQXJyYXkoNCkuZmlsbCgwKS5tYXAoKCkgPT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICAgIG1vbml0b3JQcm9taXNlc1Byb2dyZXNzKFxuICAgICAgICAgIHRhc2tzLCAocHJvZ3Jlc3M6IG51bWJlcikgPT4ge30sIHN0YXJ0RnJhY3Rpb24sIGVuZEZyYWN0aW9uKTtcbiAgICB9KS50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBlcnJvciB3aGVuIHByb21pc2VzIGlzIG51bGwnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG1vbml0b3JQcm9taXNlc1Byb2dyZXNzKG51bGwsIChwcm9ncmVzczogbnVtYmVyKSA9PiB7fSk7XG4gICAgfSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZXJyb3Igd2hlbiBwcm9taXNlcyBpcyBlbXB0eSBhcnJheScsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbW9uaXRvclByb21pc2VzUHJvZ3Jlc3MoW10sIChwcm9ncmVzczogbnVtYmVyKSA9PiB7fSk7XG4gICAgfSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xufSk7XG4iXX0=