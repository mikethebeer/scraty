
from setuptools import setup


requirements = [
    'tornado',
    'crate [sqlalchemy]'
]


test_requirements = [
    'crate [test]',
    'tornado_testing',
    'lovely.testlayers',
    'requests'
]


setup(
    name='scraty',
    install_requires=requirements,
    packages=['scraty'],
    extras_require={
        'test': test_requirements,
    },
    tests_require=test_requirements,
    entry_points={
        'console_scripts': ['app=scraty.app:main']
    },
)
