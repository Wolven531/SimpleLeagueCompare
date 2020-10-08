import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test as NestTest, TestingModule } from '@nestjs/testing'
import { agent, Test } from 'supertest'
import { AppModule } from '../src/app/app.module'

describe('AppController (e2e)', () => {
	let app: INestApplication
	let moduleFixture: TestingModule

	beforeEach(async () => {
		moduleFixture = await NestTest.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()

		await app.init()
	})

	afterEach(async () => {
		await moduleFixture.close()
		await app.close()
	})

	describe('request GET "/"', () => {
		let req: Test

		beforeEach(() => {
			req = agent(app.getHttpServer()).get('/')
		})

		it('returns 200 status and dummy text', () => {
			req.expect(HttpStatus.OK)
				.expect('Hello World!')
		})
	})
})
