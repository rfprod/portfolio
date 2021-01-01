import { TestModuleMetadata } from '@angular/core/testing';

import { MocksCoreModule } from '../modules/mocks-core.module';

/**
 * New TestBed metadata getter type.
 */
export type TNewTestBedMetadata = (metadata?: TestModuleMetadata) => TestModuleMetadata;
/**
 * New TestBed metadata getter.
 * Should be used to provide additional metadata to default test bed config.
 * Provide a result as a parameter to getTestBedConfig method.
 */
export const newTestBedMetadata: TNewTestBedMetadata = (metadata?: TestModuleMetadata) =>
  new Object({
    imports: [...(metadata?.imports ?? [])],
    declarations: [...(metadata?.declarations ?? [])],
    providers: [...(metadata?.providers ?? [])],
    schemas: [...(metadata?.schemas ?? [])],
  });

/**
 * TestBed config getter type.
 */
export type TTestBedConfigGetter = (metadata: TestModuleMetadata) => TestModuleMetadata;
/**
 * TestBed configuration getter.
 *
 * @param metadata additional test bed metadata
 */
export const getTestBedConfig: TTestBedConfigGetter = (
  metadata: TestModuleMetadata = newTestBedMetadata(),
) =>
  new Object({
    declarations: [...(metadata.declarations ?? [])],
    imports: [MocksCoreModule.forRoot(), ...(metadata.imports ?? [])],
    providers: [...(metadata.providers ?? [])],
    schemas: [...(metadata.providers ?? [])],
  });
